const express = require("express");
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  updateStatus,
  deleteEnquiry,
} = require("../controller/enquiryController");

router.post("/", createEnquiry);
router.get("/", getEnquiries);
router.get("/:id", getEnquiryById);
router.put("/:id", updateEnquiry);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteEnquiry);

module.exports = router;
