import React, { useState } from 'react';
import './Popup.css'; 

function CreateAccountPopup({ isOpen, onClose }) {
  // State to hold form values
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    birthDate: ''
  });

  // TODO: State to hold validation errors
  const [error, setError] = useState(''); 

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send form data to the backend
      const response = await fetch('http://98.80.48.42:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      console.log('Account created:', data);

      // Reset the form data after submission
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        username: '',
        password: '',
        birthDate: ''
      });

      onClose(); // Close the popup after submission
    } catch (error) {
      console.error('Error creating account:', error);
    }
  };

  // If the popup is not open, don't render it
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <span className="close-btn" onClick={onClose}>×</span>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>First Name:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
          </div>
          <div>
            <label>Last Name:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Username:</label>
            <input type="username" name="username" value={formData.username} onChange={handleChange} required />
          </div>
          <div>
            <label>Password:</label>
            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div>
            <label>Birthdate:</label>
            <input type="date" name="birthDate" value={formData.birthDate} onChange={handleChange} required />
          </div>
          <button type="submit">Create Account</button>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountPopup;
