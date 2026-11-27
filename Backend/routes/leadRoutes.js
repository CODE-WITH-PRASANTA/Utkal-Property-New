const express = require("express");
const router = express.Router();
const {
  createLead,
  getLeads,
  updateLead,
  bulkUpdateLeads,
  deleteLead,
} = require("../controller/leadController");

router.get("/", getLeads);
router.post("/", createLead);
router.patch("/bulk", bulkUpdateLeads);
router.put("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;
