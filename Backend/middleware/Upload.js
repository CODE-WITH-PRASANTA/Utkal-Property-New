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
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB limit
  fileFilter: (req, file, cb) => {
    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/pdf",
    ];
    if (!allowed.includes(file.mimetype.toLowerCase())) {
      return cb(
        new Error("Only PNG, JPG, JPEG, WEBP and PDF files are allowed")
      );
    }
    cb(null, true);
  },
}).fields([
  { name: "images", maxCount: 30 },
  { name: "floorPlans", maxCount: 15 },
]);

const makeName = (prefix = "prop") =>
  `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

// Convert uploaded files to .webp and set req.imageUrls / req.planUrls
const convertToWebp = async (req, res, next) => {
  try {
    req.imageUrls = [];
    req.planUrls = [];

    const imageFiles = (req.files && req.files.images) || [];
    for (const file of imageFiles) {
      if (file.mimetype === "application/pdf") {
        throw new Error("Property photos must be PNG, JPG, JPEG or WEBP");
      }

      const name = `${makeName("prop")}.webp`;
      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(imageDir, name));

      req.imageUrls.push(`/uploads/properties/${name}`);
    }

    const planFiles = (req.files && req.files.floorPlans) || [];
    for (const file of planFiles) {
      if (file.mimetype === "application/pdf") {
        const name = `${makeName("plan")}.pdf`;
        fs.writeFileSync(path.join(planDir, name), file.buffer);
        req.planUrls.push(`/uploads/floorplans/${name}`);
      } else {
        const name = `${makeName("plan")}.webp`;
        await sharp(file.buffer)
          .rotate()
          .resize({ width: 2400, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toFile(path.join(planDir, name));

        req.planUrls.push(`/uploads/floorplans/${name}`);
      }
    }

    next();
  } catch (error) {
    console.error("Error in property upload processing:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { upload, convertToWebp };
