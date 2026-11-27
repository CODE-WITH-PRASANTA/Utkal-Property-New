const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const sellRentDir = path.join(__dirname, "..", "uploads", "sellrent");
fs.mkdirSync(sellRentDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype.toLowerCase())) {
      return cb(new Error("Only PNG, JPG, JPEG, and WEBP images are allowed"));
    }
    cb(null, true);
  },
}).array("images", 10);

const processSellRentImages = async (req, res, next) => {
  try {
    req.imageUrls = [];
    const files = req.files || [];
    for (const file of files) {
      const name = `sr-${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(path.join(sellRentDir, name));
      req.imageUrls.push(`/uploads/sellrent/${name}`);
    }
    next();
  } catch (error) {
    console.error("Error processing sell/rent images:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { upload, processSellRentImages };
