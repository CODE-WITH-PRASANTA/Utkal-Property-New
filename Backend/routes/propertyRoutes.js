const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middleware/Upload");
const {
  createProperty,
  getProperties,
  getProperty,
  updateProperty,
  updateStatus,
  deleteProperty,
} = require("../controller//propertyController");

router.get("/", getProperties);
router.get("/:idOrSlug", getProperty);
router.post("/", upload, convertToWebp, createProperty);
router.put("/:id", upload, convertToWebp, updateProperty);
router.patch("/:id/status", updateStatus);
router.delete("/:id", deleteProperty);

module.exports = router;