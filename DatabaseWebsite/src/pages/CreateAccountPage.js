import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateAccountPage.css'; // Import the CSS file

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

  // Validation functions
  const validateName = (name) => /^[A-Za-z]+$/.test(name);
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password); //regex to match password requirements 

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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        // Submit the form data to the backend
        const response = await fetch('http://98.80.48.42:3000/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Account created:', result);
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
    <div className="create-account-container">
      <h2>Create an Account</h2>
      <p>New to Peer to Pear? Fill out the details below to create an account today!</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div>
          <label>Birth Date:</label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" className="login-form-button">Create Account</button>
      </form>
      <p>
        Already have an account? <Link to="/LogInPage">Log in here</Link>
      </p>
    </div>
  );
}

export default CreateAccountPage;

