import React, { useState } from "react";
import axios from "axios";

const SignupUser = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    idType: "", // Aadhar, PAN, or Birth Certificate
    idFile: null,
    guardianName: "",
    guardianAadhar: null, // Aadhar card for the guardian
  });

  const [isUnderThree, setIsUnderThree] = useState(false);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "age" && parseInt(value) < 3) {
      setIsUnderThree(true);
    } else if (name === "age") {
      setIsUnderThree(false);
    }
  };

  // Handle file upload
  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that user has uploaded an Aadhar, PAN, or Birth Certificate
    if (!formData.idFile) {
      alert("Please upload an ID (Aadhar, PAN, or Birth Certificate).");
      return;
    }

    const formPayload = new FormData();
    Object.keys(formData).forEach((key) => {
      formPayload.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup/user",
        formPayload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Signup successful");
    } catch (error) {
      console.error("Error during signup:", error);
      alert("Signup failed");
    }
  };

  return (
    <div>
      <h2>User Signup</h2>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" name="name" required onChange={handleChange} />

        <label>Phone:</label>
        <input type="text" name="phone" required onChange={handleChange} />

        <label>Email:</label>
        <input type="email" name="email" required onChange={handleChange} />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          required
          onChange={handleChange}
        />

        <label>Age:</label>
        <input type="number" name="age" required onChange={handleChange} />

        <label>Gender:</label>
        <select name="gender" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        <label>Blood Group:</label>
        <input type="text" name="bloodGroup" onChange={handleChange} />

        <label>Height (cm):</label>
        <input type="number" name="height" onChange={handleChange} />

        <label>Weight (kg):</label>
        <input type="number" name="weight" onChange={handleChange} />

        <label>ID Type:</label>
        <select name="idType" required onChange={handleChange}>
          <option value="">Select</option>
          <option value="aadhar">Aadhar Card</option>
          <option value="pan">PAN Card</option>
          {isUnderThree && (
            <option value="birthCertificate">Birth Certificate</option>
          )}
        </select>

        {formData.idType && (
          <>
            <label>
              {formData.idType === "birthCertificate"
                ? "Birth Certificate"
                : `${formData.idType} Upload`}
              :
            </label>
            <input
              type="file"
              name="idFile"
              required
              onChange={handleFileChange}
            />
          </>
        )}

        {isUnderThree && (
          <>
            <label>Guardian Name:</label>
            <input
              type="text"
              name="guardianName"
              required
              onChange={handleChange}
            />

            <label>Guardian Aadhar Upload:</label>
            <input
              type="file"
              name="guardianAadhar"
              required
              onChange={handleFileChange}
            />
          </>
        )}

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default SignupUser;
