import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const navigateHome = () => {
    navigate('/');
  };

  const navigateSignUp = () => {
    navigate('/create');
  };

  const navigateForgot = () => {
    navigate('/forgot');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, {
        email,  // Email for login
        password, // Password for login
      });
      

        const { accessToken, refreshToken, user } = response.data;

        sessionStorage.setItem("accessToken", accessToken);
        sessionStorage.setItem("refreshToken", refreshToken);

        navigate(`/home/${user.id}`);
    } catch (err) {
        if (err.response && err.response.data.message) {
            setError(err.response.data.message);
        } else {
            setError("An unexpected error occurred. Please try again.");
        }
    }
};


  return (
    <div className="login_form">
      <form onSubmit={handleSubmit}>
        <img
          src={`${process.env.PUBLIC_URL}/favicon-formatted.png`}
          alt="WorkConnect logo"
          style={{ width: "150px", height: "120px" }}
          className="favicon-image"
          onClick={navigateHome}
        />
        <h2>Log in</h2>
        {error && <div className="error-message">{error}</div>}

        <div className="input_box">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input_box">
          <div className="password_title">
            <label htmlFor="password">Password</label>
            <a className="login-link" onClick={navigateForgot}>Forgot Password?</a>
          </div>

          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary btn-margin-bottom">Log In</button>

        <p className="sign_up">
          Don't have an account?{" "}
          <a className="login-link" onClick={navigateSignUp}>
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
