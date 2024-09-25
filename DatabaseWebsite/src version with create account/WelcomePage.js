import React, { useState } from 'react';
import Button from './Button';
import './WelcomePage.css';
import './Button.css';
import { handleClick, togglePopup } from './Button';  // Importing logic from Button.js
import CreateAccountPopup from './CreateAccountPopup';

function WelcomePage() {
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [users, setUsers] = useState([]);
    const [collection, setCollection] = useState('');
    const [isUserListVisible, setUserListVisible] = useState(false);

    const viewUsers = async () => {
        if (!isUserListVisible) {
            await handleClick('users', setUsers, setCollection); // Calls the exported handleClick function
        }
        setUserListVisible(!isUserListVisible); // Toggle user list visibility
    };

    const handleTogglePopup = () => {
        setPopupOpen(!isPopupOpen); // Toggle popup directly
    };

  return (
    <div className="welcome-page">
      <h1>Welcome to PeerToPear</h1>

      {/* Button Layout */}
      <Button 
        togglePopup={handleTogglePopup}
        handleClick={viewUsers}
      />

      {/* Pop-up for Create Account */}
      <CreateAccountPopup isOpen={isPopupOpen} onClose={handleTogglePopup} />

      {/* Scrollable User List */}
      {isUserListVisible && ( // Render only if the user list is visible
      <div className="scrollable-panel">
        <h1>Users</h1>
        <ul>
          {users.length === 0 ? (
            <li>No users found</li>
          ) : (
            users.map(user => (
              <li key={user._id}>
                <div className="list-section">
                  <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <p><strong>Username:</strong> {user.username}</p>
                  <p><strong>Password:</strong> {user.password}</p>
                  <p><strong>BirthDate</strong> {user.birthDate}</p>
                  <p><strong>Creation Date</strong> {user.creationDate}</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      )}
    </div>
  );
}

export default WelcomePage;
