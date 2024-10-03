import React, { useState } from 'react';
import './LogInPage.css'; // importing the css 
import { storeUserId } from '../userData/user';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom


function LogInPage() { //manage state of log in form
  const [formData, setFormData] = useState({
    username: '', //default values 
    password: '',
  });

  const [errors, setErrors] = useState({}); // useState manages the errors 
  const [serverError, setServerError] = useState(''); // Manages server-side login errors

  // Get navigate function from useNavigate
  const navigate = useNavigate();

  const validateUsername = (username) => username.trim() !== ''; // removing whitespace from the user input assuming it is not empty
  const validatePassword = (password) => password.trim() !== '';

  // Handle input change and triggered when user inputs data into the fields
  const handleChange = (e) => { // e is event object 
    const { name, value } = e.target; // html that triggered the event, name is username/pass and value is what user types in
    setFormData({ ...formData, [name]: value }); // spread operator to ensure when user enters username field it doesnt overwrite assignment to the password value 
  };

  // Handle form submission, triggered when log in button is clicked 
  const handleSubmit = async (e) => {
    e.preventDefault(); //suppress page reload 
    const newErrors = {}; // holds errors with user input

    if (!validateUsername(formData.username)) { // throws error if username is empty, future funct is if it is also not found in db
      newErrors.username = 'Username not found, please try again.';
    }

    if (!validatePassword(formData.password)) { // throws error on invalid password/username key
      newErrors.password = 'Incorrect Password for username, try again or try resetting password.';
    }

    if (Object.keys(newErrors).length > 0) { // store error messages 
      setErrors(newErrors);
    } else { // if no errors found from if, proceed with submission
      try {
        const response = await fetch('http://98.80.48.42:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        // Check if login was successful
        if (response.ok) {
          console.log('Login successful:', result);
          const userId = result.user.userId;
          storeUserId(userId);
          setFormData({ //reset values after successful log in
            username: '',
            password: '',
          });
          setErrors({}); // reset errors state
          setServerError(''); // reset server error state

          // Redirect to profile page
          navigate('/ProfilePage'); // Navigate to the dashboard page
        } else {
          // Display error if login fails
          setServerError('Invalid username or password. Please try again.');
        }
      } catch (error) {
        console.error('Error during login:', error);
        setServerError('There was a problem with the login. Please try again later.');
      }
    }
 };

  return ( //styling and CSS connections 
    <div className="login-container">  
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Welcome to Pear to Peer</h2> 
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username} // bind to component state between username and entered value 
            onChange={handleChange} //listen to changes 
            required //form will not submit if either field is empty 
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="header">
         <img src="Designer.png" alt="Logo" className="logo" />
            <h1>Pear to Peer</h1>
        </div>

        {serverError && <p className="error">{serverError}</p>} {/* Display server-side errors */}

        <button type="submit">Login</button> 
        <div className="links">
          <p className="login2-link">
          New to Pear to Peer? <Link to="/CreateAccountPage" className="b-link">Create an account</Link>
          </p>
          <p className="login3-link">
          Forgot your password? <Link to="/ResetPassword" className="blu-link">Reset your password</Link> 
          </p>
        </div>
      </form>
    </div>
  );
}

export default LogInPage; // make it to be able to import easier and default for other app pages 
