import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getUserDataByUsername = async (userName, token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const response = await axios.get(
        `http://localhost:8080/api/users/username/${userName}`,
        { headers }
      );

      const userId = response.data.id;
      const userRole = response.data.role;

      localStorage.setItem("userId", userId);
      localStorage.setItem("role", userRole);

      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8080/api/login", {
        userName,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", userName);

      const userData = await getUserDataByUsername(userName, token);

      if (userData) {
        navigate("/dashboard/restaurants");
      } else {
        setError("Unable to fetch user data. Please try again.");
      }
    } catch (error) {
      setError("Invalid username or password. Please try again.");
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-header">Login</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="userName">Username</label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" className="btn primary-btn">Login</button>
            <button type="button" className="btn back-btn" onClick={handleBack}>Home</button>
          </div>
        </form>
        <div className="signup-link">
          <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
