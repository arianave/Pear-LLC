import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../CSS/DeleteAccount.css'; //importing the css

const DeleteAccount = ({ username }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    if (password === "correct_password") { // Replace with actual verification logic
      alert("We’re sorry to see you go! If you ever change your mind, create another account!");
      navigate("/LogInPage"); // Redirect to login page
    } else {
      setError("Incorrect password. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    navigate("/ForgotPassword"); // Redirect to Forgot Password page
  };

  return (
    <div className="delete-account-page">
      <h2>Delete Account</h2>
      <p>
        Please enter the password for the account: <strong>{username}</strong> to verify and delete
        the account.
      </p>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="forgot-password-link" onClick={handleForgotPassword}>
        Forgot Password?
      </button>
      <button className="confirm-delete-btn" onClick={handleDeleteAccount}>
        Confirm Delete
      </button>
    </div>
  );
};

export default DeleteAccount;
