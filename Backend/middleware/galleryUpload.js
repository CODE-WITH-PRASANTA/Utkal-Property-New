const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const galleryDir = path.join(__dirname, "..", "uploads", "galleries");
fs.mkdirSync(galleryDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit per image
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype.toLowerCase())) {
      return cb(new Error("Only PNG, JPG, JPEG and WEBP images are allowed"));
    }
    cb(null, true);
  },
}).array("images", 30);

const makeName = () => `gallery-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

const convertGalleryImagesToWebp = async (req, res, next) => {
  try {
    req.imageUrls = [];
    const files = req.files || [];

    for (const file of files) {
      const name = `${makeName()}.webp`;
      const outputPath = path.join(galleryDir, name);

      await sharp(file.buffer)
        .rotate()
        .resize({ width: 1920, withoutEnlargement: true })
        .webp({ quality: 85 })
        .toFile(outputPath);

      req.imageUrls.push(`/uploads/galleries/${name}`);
    }

    next();
  } catch (error) {
    console.error("Gallery image conversion error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { uploadGalleryImages: upload, convertGalleryImagesToWebp };
