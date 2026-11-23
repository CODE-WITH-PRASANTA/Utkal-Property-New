const express = require("express");
const router = express.Router();
const {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  bulkDeleteMembers,
  updateMemberStatus,
} = require("../controller/teamController");
const {
  uploadTeamImage,
  convertTeamImageToWebp,
} = require("../middleware/teamUpload");

// Base: /api/team
router.route("/")
  .get(getMembers)
  .post(uploadTeamImage, convertTeamImageToWebp, createMember);

router.post("/bulk-delete", bulkDeleteMembers);

router.patch("/:id/status", updateMemberStatus);

router.route("/:id")
  .get(getMemberById)
  .put(uploadTeamImage, convertTeamImageToWebp, updateMember)
  .delete(deleteMember);

module.exports = router;
