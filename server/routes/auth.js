const express = require("express");
const multer = require("multer");
const { signupUser } = require("../controllers/authController");

const router = express.Router();

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

// Signup route
router.post(
  "/signup/user",
  upload.fields([
    { name: "idFile", maxCount: 1 },
    { name: "guardianAadhar", maxCount: 1 },
  ]),
  signupUser
);

module.exports = router;
