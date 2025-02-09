const express = require("express");
const multer = require("multer");
const { uploadDocument } = require("../controllers/authController");

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

// Create the route for uploading documents
const router = express.Router();

router.post("/", upload.single("document"), uploadDocument);

module.exports = router;
