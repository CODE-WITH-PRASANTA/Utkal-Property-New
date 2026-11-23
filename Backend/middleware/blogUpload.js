const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const blogDir = path.join(__dirname, "..", "uploads", "blogs");
fs.mkdirSync(blogDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error("Only PNG, JPG, JPEG and WEBP image files are allowed"));
    }
    cb(null, true);
  },
});

const uploadBlogImage = upload.single("image");

const makeName = () => `blog-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

// Convert single uploaded image to .webp and set req.blogImageUrl
const convertBlogImageToWebp = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    if (req.file.size > 8 * 1024 * 1024) {
      throw new Error(`${req.file.originalname}: max 8 MB allowed`);
    }

    const name = `${makeName()}.webp`;
    const outputPath = path.join(blogDir, name);

    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(outputPath);

    req.blogImageUrl = `/uploads/blogs/${name}`;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { uploadBlogImage, convertBlogImageToWebp };
