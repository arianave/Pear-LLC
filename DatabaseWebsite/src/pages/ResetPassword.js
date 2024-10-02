import React, { useState } from 'react';
import './ResetPassword.css'; // importing the css
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

/*

ideal functionality, find username key in database, find its email associated, send an email to the email address
then the email will contain a link, link opens to a new page and allows user to enter and reenter theirpassword from unique 
link and it will update in the database

*/



function ResetPassword() { 
  // Manage state for username input
  const [username, setUsername] = useState(''); //to hold chaning value
  const [errors, setErrors] = useState('');

  // takeout whitespace from username, user interaction error
  const validateUsername = (username) => username.trim() !== '';

  // Handle input change for username
  const handleChange = (e) => {
    setUsername(e.target.value);
  };

  // Handle form submission when the user clicks "Send Email"
  const handleSubmit = (e) => {
    e.preventDefault(); //prevent reloading page
    if (!validateUsername(username)) {
      setErrors('Username entered does not match any exsisting accounts.');
    } else {
      console.log('Email submitted:', username); // case where username found
      setUsername(''); // Reset the username field after submission
      setErrors(''); // Reset errors state
    }
  };

  return (
    <div className="reset-password-container">
      <form onSubmit={handleSubmit} className="reset-password-form">
        <h2>Forgot your password?</h2>
        <p>Enter your username to receive an email with a link to a new password.</p>
        
        <div>
          <label>Username:</label>
          <input
            type="username"
            name="username"
            value={username} // Bind username state
            onChange={handleChange} // Listen to changes
            required // Form will not submit if empty
          />
          {errors && <p className="error">{errors}</p>}
        </div>
        
        <button type="submit" className="send-email-button">Send Email</button> 
        
        <p className="login-link">
          Need to log in? <Link to="/LogInPage" className="blue-link">Log in here</Link>
        </p>
      </form>
    </div>
  );
}

export default ResetPassword;
