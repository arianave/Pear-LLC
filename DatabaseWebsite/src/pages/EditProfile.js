// EditProfile.js

import '../CSS/EditProfile.css'; //importing the css
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom
import { getUserId, getUserInfo, setProfileInfo } from '../userData/user';

const EditProfile = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [isPrivate, setIsPrivate] = useState(false);
  const [biography, setBiography] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const userId = getUserId();
  const navigate = useNavigate();

  // Fetch user info when the component loads
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getUserInfo(userId);
        setProfilePicture(userInfo.profilePicture || "/gray_pfp.png"); // Default if no profile picture
        setBiography(userInfo.profileBiography || ""); // Default to empty string
        setIsPrivate(userInfo.isPrivate || false); // Default to false
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        alert("Could not load profile information.");
      }
    };

    fetchUserInfo();
  }, [userId]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = () => {
    console.log("Profile changes saved:", { profilePicture, isPrivate, biography });
    setProfileInfo(biography, profilePicture, isPrivate);
    alert("Profile updated successfully!");
  };

  const handleDeleteAccount = () => {
    setShowDeletePopup(true);
  };

  const confirmDeleteAccount = (confirm) => {
    setShowDeletePopup(false);
    if (confirm) {
      navigate("/DeleteAccount");
    }
  };

    // Handle back navigation to profile page
    const handleBack = () => {
        navigate("./ProfilePage"); // Navigate to the profile page
      };
    
    

  return (
     <div className="edit-profile">

        <Link to={`/ProfilePage/${userId}`} className="back-link" aria-label="Back to Profile">
        {' ← '}
      </Link>

      <h2>Edit Profile</h2>
      <div className="profile-picture-container">
        <img
          src={profilePicture || "/gray_pfp.png"}
          alt="Profile"
          className="profile-picture"
          onClick={() => document.getElementById("file-input").click()}
        />
        <input
          type="file"
          id="file-input"
          style={{ display: "none" }}
          accept="image/*"
          onChange={handleProfilePictureChange}
        />
      </div>

      <div className="private-account-container">
        <span className="toggle-label">Private Account?</span>
        <label className="switch">
          <input
            type="checkbox"
            className="switch-input"
            checked={isPrivate} // Bind to the state
            onChange={(e) => setIsPrivate(e.target.checked)} // Update the state on change
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="biography-section">
        <label>
          Biography (max 250 characters):
          <textarea
            value={biography}
            onChange={(e) => setBiography(e.target.value.slice(0, 250))}
            maxLength={250}
            placeholder="Write a short biography..."
          />
        </label>
      </div>

      <button className="delete-account-btn" onClick={handleDeleteAccount}>
        Delete Account
      </button>

      {/* Apply blur effect only when popup is shown */}
      {showDeletePopup && <div className="background-blur" />}

      {/* The popup */}
      {showDeletePopup && (
        <div className="delete-popup">
          <p>Are you sure you want to delete your account? This action is irreversible.</p>
          <button onClick={() => confirmDeleteAccount(true)}>Yes</button>
          <button onClick={() => confirmDeleteAccount(false)}>No</button>
        </div>
      )}
      
      <button className="save-changes-btn" onClick={handleSaveChanges}>
        Save Changes
      </button>
    </div>
  );
};

export default EditProfile;

/*import React from 'react';
import '../CSS/EditProfile.css'; //importing the css

const EditProfile = () => {
    return (
        <div>
            <h1>Edit Profile</h1>
            <p>Here,  to edit their profile details.</p>
        </div>
    );
};

export default EditProfile;
*/