import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';
import './Register.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    userName: "",
    password: "",
    address: "",
    city: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/register", {
        ...formData,
        role: "USER",
        isActive: true,
      });

      if (response.status === 200 || response.status === 201) {
        Swal.fire({
          title: 'Registration Successful!',
          text: 'You can now log in with your credentials.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => {
          navigate("/login");
        });
      } else {
        setError("Error during registration. Please try again.");
      }
    } catch (error) {
      setError("Error during registration. Please try again.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2 className="register-header">Register</h2>
        {error && <p className="error-message">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleNext}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="button-container">
              <button type="submit" className="btn primary-btn">Next</button>
              <button type="button" className="btn back-btn" onClick={handleBack}>Back</button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="userName">Username</label>
              <input
                type="text"
                id="userName"
                value={formData.userName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                type="text"
                id="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>
            <div className="button-container">
              <button type="submit" className="btn primary-btn">Register</button>
              <button type="button" className="btn back-btn" onClick={handleBack}>Back</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;
