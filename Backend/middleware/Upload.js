const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const imageDir = path.join(__dirname, "..", "uploads", "properties");
const planDir = path.join(__dirname, "..", "uploads", "floorplans");
fs.mkdirSync(imageDir, { recursive: true });
fs.mkdirSync(planDir, { recursive: true });

// Keep file in memory, convert to webp before saving
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, WEBP and PDF files are allowed"));
    }
    cb(null, true);
  },
}).fields([
  { name: "images", maxCount: 20 },
  { name: "floorPlans", maxCount: 10 },
]);

const makeName = () => `${Date.now()}-${Math.round(Math.random() * 1e9)}`;

// Convert uploaded files to .webp and set req.imageUrls / req.planUrls
const convertToWebp = async (req, res, next) => {
  try {
    req.imageUrls = [];
    req.planUrls = [];

    for (const file of (req.files && req.files.images) || []) {
      if (file.mimetype === "application/pdf") throw new Error("Images must be PNG, JPG or WEBP");
      if (file.size > 5 * 1024 * 1024) throw new Error(`${file.originalname}: max 5 MB allowed`);

      const name = `${makeName()}.webp`;
      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(path.join(imageDir, name));
      req.imageUrls.push(`/uploads/properties/${name}`);
    }

    for (const file of (req.files && req.files.floorPlans) || []) {
      if (file.mimetype === "application/pdf") {
        const name = `${makeName()}.pdf`;
        fs.writeFileSync(path.join(planDir, name), file.buffer);
        req.planUrls.push(`/uploads/floorplans/${name}`);
      } else {
        const name = `${makeName()}.webp`;
        await sharp(file.buffer)
          .rotate()
          .resize({ width: 2400, withoutEnlargement: true })
          .webp({ quality: 90 })
          .toFile(path.join(planDir, name));
        req.planUrls.push(`/uploads/floorplans/${name}`);
      }
    }

    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { upload, convertToWebp };