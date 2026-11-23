const express = require("express");
const router = express.Router();
const {
  uploadBlogImage,
  convertBlogImageToWebp,
} = require("../middleware/blogUpload");
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
} = require("../controller/blogController");

// Public routes for blog fetching
router.get("/", getBlogs);
router.get("/:idOrSlug", getBlog);

// Admin routes for blog creation, editing, deletion
router.post("/", uploadBlogImage, convertBlogImageToWebp, createBlog);
router.put("/:id", uploadBlogImage, convertBlogImageToWebp, updateBlog);
router.delete("/:id", deleteBlog);

module.exports = router;
