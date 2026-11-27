const jwt = require("jsonwebtoken");

const loginAdmin = (req, res) => {
  try {
    const rawUserId = req.body?.userId ?? req.body?.identifier ?? req.body?.username ?? "";
    const rawPassword = req.body?.password ?? "";

    const userId = String(rawUserId).trim();
    const password = String(rawPassword);

    const envUserId = (process.env.ADMIN_USER_ID || "").trim();
    const envPassword = process.env.ADMIN_PASSWORD || "";
    const jwtSecret = process.env.JWT_SECRET;

    if (!envUserId || !envPassword || !jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "Admin authentication is not configured in environment variables",
      });
    }

    if (!userId || !password) {
      return res.status(400).json({
        success: false,
        message: "User ID and password are required",
      });
    }

    if (userId !== envUserId || password !== envPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid User ID or password",
      });
    }

    const token = jwt.sign(
      {
        userId: envUserId,
        role: "admin",
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        userId: envUserId,
        role: "admin",
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to authenticate admin",
      error: error.message,
    });
  }
};

const verifyAdminSession = (req, res) => {
  return res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

module.exports = {
  loginAdmin,
  verifyAdminSession,
};
