const express = require("express");
const router = express.Router();
const {
  createGallery,
  getGalleries,
  getGalleryById,
  updateGallery,
  deleteGallery,
  bulkDeleteGalleries,
  updateGalleryStatus,
} = require("../controller/galleryController");
const {
  uploadGalleryImages,
  convertGalleryImagesToWebp,
} = require("../middleware/galleryUpload");

// Base: /api/galleries
router.route("/")
  .get(getGalleries)
  .post(uploadGalleryImages, convertGalleryImagesToWebp, createGallery);

router.post("/bulk-delete", bulkDeleteGalleries);

router.patch("/:id/status", updateGalleryStatus);

router.route("/:id")
  .get(getGalleryById)
  .put(uploadGalleryImages, convertGalleryImagesToWebp, updateGallery)
  .delete(deleteGallery);

module.exports = router;
