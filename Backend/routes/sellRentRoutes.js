const express = require("express");
const router = express.Router();
const { upload, processSellRentImages } = require("../middleware/sellRentUpload");
const {
  createListing,
  getListings,
  updateListing,
  bulkUpdateListings,
  deleteListing,
} = require("../controller/sellRentController");

router.get("/", getListings);
router.post("/", upload, processSellRentImages, createListing);
router.patch("/bulk", bulkUpdateListings);
router.put("/:id", updateListing);
router.delete("/:id", deleteListing);

module.exports = router;
