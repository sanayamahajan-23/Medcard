const path = require("path");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const fs = require("fs"); // Import fs module to delete files
const {
  validateFileType,
  validateImageSize,
  extractQRCode,
  ocrOnFile,
  validateDocument,
} = require("../middleware/fileValidation");

const signupUser = async (req, res) => {
  try {
    const {
      name,
      phone,
      email,
      password,
      age,
      gender,
      bloodGroup,
      height,
      weight,
      idType,
      guardianName,
    } = req.body;

    const idFilePath = req.files["idFile"]
      ? path.join(__dirname, "../uploads", req.files["idFile"][0].filename)
      : null;
    const guardianAadharPath = req.files["guardianAadhar"]
      ? path.join(
          __dirname,
          "../uploads",
          req.files["guardianAadhar"][0].filename
        )
      : null;

    // Validate ID file if provided
    if (idFilePath) {
      try {
        validateFileType(req.files["idFile"][0]);
        validateImageSize(idFilePath);

        // Check for QR code in the ID file
        const qrCodeData = await extractQRCode(idFilePath);
        if (!qrCodeData) {
          throw new Error("No QR code found in the document");
        }

        // Validate QR Code data (check for PAN or Aadhar number)
        if (qrCodeData.includes("Aadhar")) {
          console.log("Aadhar card QR code detected");
        } else if (qrCodeData.includes("PAN")) {
          console.log("PAN card QR code detected");
        } else {
          throw new Error("Invalid QR code data");
        }

        // Proceed with OCR extraction for additional validation if needed
        const idText = await ocrOnFile(idFilePath);
        const idValidationMessage = validateDocument(idText);
        if (!idValidationMessage) {
          throw new Error("Invalid ID file. Neither Aadhar nor PAN detected.");
        }
      } catch (err) {
        console.error(err);
        // If any validation fails, remove the invalid file
        if (fs.existsSync(idFilePath)) {
          fs.unlinkSync(idFilePath); // Remove invalid file
        }
        throw new Error("ID file validation failed: " + err.message);
      }
    }

    // Validate Guardian Aadhar file if provided
    if (guardianAadharPath) {
      try {
        validateFileType(req.files["guardianAadhar"][0]);
        validateImageSize(guardianAadharPath);

        const guardianText = await ocrOnFile(guardianAadharPath);
        const guardianValidationMessage = validateDocument(guardianText);
        if (!guardianValidationMessage) {
          throw new Error("Invalid Guardian Aadhaar file.");
        }
      } catch (err) {
        console.error(err);
        // If any validation fails, remove the invalid file
        if (fs.existsSync(guardianAadharPath)) {
          fs.unlinkSync(guardianAadharPath); // Remove invalid file
        }
        throw new Error(
          "Guardian Aadhar file validation failed: " + err.message
        );
      }
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      age,
      gender,
      bloodGroup,
      height,
      weight,
      governmentIDs: {
        [idType]: idFilePath,
      },
      guardian:
        age < 3 ? { name: guardianName, aadharCard: guardianAadharPath } : null,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};

module.exports = { signupUser };
