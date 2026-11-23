const express = require("express");
const router = express.Router();
const {
  createReview,
  getReviews,
  updateReviewStatus,
  deleteReview,
} = require("../controller/propertyReviewController");

router.post("/", createReview);
router.get("/", getReviews);
router.patch("/:id/status", updateReviewStatus);
router.delete("/:id", deleteReview);

module.exports = router;
