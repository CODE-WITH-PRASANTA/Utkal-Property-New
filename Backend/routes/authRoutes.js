const express = require("express");
const { loginAdmin, verifyAdminSession } = require("../controller/authController");
const { verifyAdminToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/login", loginAdmin);
router.get("/verify", verifyAdminToken, verifyAdminSession);

module.exports = router;
