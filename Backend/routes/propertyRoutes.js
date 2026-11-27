const express = require("express");
const router = express.Router();
const { upload, convertToWebp } = require("../middleware/Upload");
const {
  createProperty,
  getProperties,
  getProperty,
  downloadBrochure,
  updateProperty,
  updateStatus,
  togglePropertyFlag,
  deleteProperty,
} = require("../controller/propertyController");

router.get("/", getProperties);
router.get("/:idOrSlug/brochure", downloadBrochure);
router.get("/:idOrSlug", getProperty);
router.post("/", upload, convertToWebp, createProperty);
router.put("/:id", upload, convertToWebp, updateProperty);
router.patch("/:id/status", updateStatus);
router.patch("/:id/toggle", togglePropertyFlag);
router.delete("/:id", deleteProperty);

module.exports = router;
