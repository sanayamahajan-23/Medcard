const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String },
  bloodGroup: { type: String },
  height: { type: Number },
  weight: { type: Number },
  governmentIDs: {
    aadhar: { type: String }, // Store the file path for Aadhar card
    pan: { type: String }, // Store the file path for PAN card
    birthCertificate: { type: String }, // Store the file path for Birth Certificate
  },
  guardian: {
    name: { type: String },
    aadharCard: { type: String }, // Store the file path for Guardian Aadhar card
  },
  medicalRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MedicalRecord", // Linking to a medical records schema
    },
  ],
  schemes: [
    {
      type: String, // To store the list of schemes the user is eligible for
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
