const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const teamDir = path.join(__dirname, "..", "uploads", "team");
fs.mkdirSync(teamDir, { recursive: true });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowed.includes(file.mimetype.toLowerCase())) {
      return cb(new Error("Only PNG, JPG, JPEG and WEBP image files are allowed"));
    }
    cb(null, true);
  },
});

const uploadTeamImage = upload.single("image");

const makeName = () => `team-${Date.now()}-${Math.round(Math.random() * 1e9)}`;

const convertTeamImageToWebp = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const name = `${makeName()}.webp`;
    const outputPath = path.join(teamDir, name);

    await sharp(req.file.buffer)
      .rotate()
      .resize({ width: 800, height: 1000, fit: "cover", position: "top" })
      .webp({ quality: 85 })
      .toFile(outputPath);

    req.teamImageUrl = `/uploads/team/${name}`;
    next();
  } catch (error) {
    console.error("Team image conversion error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = { uploadTeamImage, convertTeamImageToWebp };
