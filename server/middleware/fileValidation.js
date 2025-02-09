const fs = require("fs");
const sizeOf = require("image-size");
const Tesseract = require("tesseract.js");
const { Jimp } = require("jimp");
const QrCode = require("qrcode-reader");

// Validate file type (allow only image and PDF)
const validateFileType = (file) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error(
      "Invalid file type. Only JPG, PNG, and PDF files are allowed."
    );
  }
};

// Validate file size (max 5MB) and dimensions (min width and height)
const validateImageSize = (filePath) => {
  const stats = fs.statSync(filePath);
  const fileSize = stats.size; // in bytes
  const maxFileSize = 5 * 1024 * 1024; // Max 5MB

  if (fileSize > maxFileSize) {
    throw new Error("File size exceeds the 5MB limit");
  }

  const dimensions = sizeOf(filePath);
  const minWidth = 300; // Minimum width of the document image
  const minHeight = 400; // Minimum height of the document image

  if (dimensions.width < minWidth || dimensions.height < minHeight) {
    throw new Error("Image dimensions are too small");
  }
};

const extractQRCode = async (filePath) => {
  try {
    const image = await Jimp.read(filePath); // Ensure you use async/await
    const qr = new QrCode();
    qr.callback = (err, value) => {
      if (err) {
        throw new Error("Error scanning QR Code");
      } else {
        resolve(value);
      }
    };
    qr.decode(image.bitmap);
  } catch (err) {
    throw new Error("Error reading image: " + err);
  }
};
// OCR function to extract text from the uploaded file
const ocrOnFile = (filePath) => {
  return new Promise((resolve, reject) => {
    Tesseract.recognize(filePath, "eng", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        resolve(text);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

// Validate document type (Aadhar, PAN) from extracted text
const validateDocument = (text) => {
  const aadharPattern = /\d{12}/; // Aadhar card format (12 digits)
  const panPattern = /[A-Z]{5}\d{4}[A-Z]{1}/; // PAN card format (5 letters, 4 digits, 1 letter)

  if (aadharPattern.test(text)) {
    return "Aadhar card detected";
  } else if (panPattern.test(text)) {
    return "PAN card detected";
  } else {
    return null;
  }
};

module.exports = {
  validateFileType,
  validateImageSize,
  extractQRCode,
  ocrOnFile,
  validateDocument,
};
