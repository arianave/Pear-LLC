import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/CreateAccountPage.css'; //importing the css
import { useNavigate } from 'react-router-dom';
import { storeUserId } from '../userData/user';
import getServerURL from './serverURL';


function CreateAccountPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Validation functions
  const validateName = (name) => /^[A-Za-z]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password); //regex to match password requirements 
 
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    // Adjust age if the birthdate hasn't occurred yet this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    return age;
  };

    // Handle input change
  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   // Handle form submission
   const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate first name
    if (!validateName(formData.firstName)) {
      newErrors.firstName = 'First name must contain only letters.';
    }

    // Validate last name
    if (!validateName(formData.lastName)) {
      newErrors.lastName = 'Last name must contain only letters.';
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      newErrors.password =
        'Password must be at least 8 characters long, including one uppercase letter, one lowercase letter, one number, and one special character.';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    // Age validation (user must be 13 or older)
    const age = calculateAge(formData.birthDate);
      if (age < 13) {
        newErrors.birthDate = 'You must be 13 years or older to create an account.';
    }    

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Submit the form data to the backend
        const response = await fetch(`${getServerURL()}/api/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Account created:', result);
          storeUserId(result.user._id);
          // Reset form
          setFormData({
            firstName: '',
            lastName: '',
            birthDate: '',
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
          });
          setErrors({});
          navigate('/HomeFeed');

        } else {
          console.error('Failed to create account:', result.message);
          setErrors({ apiError: result.message });
        }
      } catch (error) {
        console.error('Error creating account:', error);
        setErrors({ apiError: 'There was an error creating your account. Please try again.' });
      }
    }
  };


  return (
    <div className="setup"> {/* Apply the .setup class here */}
      <div className="container-c1">
        <div className="header-login">
          <img src="Designer.png" alt="Logo" className="logo" />
          <h1>Pear to Peer</h1>
        </div>
  
        <h2>Create an Account</h2>
        <p>New to Peer to Pear? Fill out the details below to create an account today!</p>
  
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="first name">First Name:</label>
            <input s
              type="text"
              id = "first name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            {errors.firstName && <p className="error">{errors.firstName}</p>}
          </div>
          <div>
            <label htmlFor="last name">Last Name:</label>
            <input s
              type="text"
              id = "last name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
            {errors.lastName && <p className="error">{errors.lastName}</p>}
          </div>
          <div>
            <label htmlFor="birth date">Birth Date:</label>
            <input s
              type="date"
              id = "birth date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              required
            />
            {errors.birthDate && <p className="error">{errors.birthDate}</p>}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input s
              type="email"
              id = "email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <input s
              type="text"
              id ="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input s
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword">Password Confirmation:</label>
            <input s
              type="password"
              id = "confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
          </div>
          <button type="submit" className="button">Create Account</button>
        </form>
  
        <p className="login1-link">
          Already have an account? <Link to="/LogInPage" className="bl-link">Log in here</Link>
        </p>
      </div>
    </div> // Closing tag for .setup div
  );
  
}

export default CreateAccountPage;

