import React, { useState } from 'react';
import './ProfilePage.css'; 
import { useNavigate } from 'react-router-dom';
import { getUserPosts } from '../userData/userPosts';

function ProfilePage() {
  // Mock data, info will be fetched from the server
  const [profile, setProfile] = useState({
    username: 'JohnDoe', // Will show user's username
    bio: 'This is my biography!', // Bio
    totalPosts: 10, // Post count
    followers: 200, // Followers count
    following: 150, // Following/threads count
    isFollowing: false, // State for following/unfollowing
  });

  const navigate = useNavigate();

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    navigate('/EditProfile'); //Edit profile page doesnt yet exist
  };

  const handleLogout = () => {
    console.log('Logging out');
    // Logic for logging out the user to be implemented 
    navigate('/LogInPage');
  };

  const handleFollowUnfollow = () => {
    // Logic to follow/unfollow user to be implemented
    setProfile((prevProfile) => ({
      ...prevProfile,
      isFollowing: !prevProfile.isFollowing,
    }));
  };

  const handleViewPhotosVideos = () => {
    // Logic for viewing user's photos/videos to be implemented
    console.log('Viewing photos/videos...');
  };

  const handleViewThreads = () => {
    // Logic for viewing user's threads to be implemented
    console.log('Viewing threads...');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{profile.username}</h1>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>

      <div className="profile-body">
        <div className="profile-picture">
          <img src="gray_pfp.png" alt="Anonymous user" className="avatar" />
        </div>
        <div className="profile-info">
          <p>{profile.bio}</p>
          <div className="profile-stats">
            <div className="stat">
              <p>{profile.totalPosts}</p>
              <p>Posts</p>
            </div>
            <div className="stat">
              <p>{profile.followers}</p>
              <p>Followers</p>
            </div>
            <div className="stat">
              <p>{profile.following}</p>
              <p>Following</p>
            </div>
          </div>

          <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
          <button className="follow-button" onClick={handleFollowUnfollow}>
            {profile.isFollowing ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      </div>

      <div className="profile-uploads-section">
        <hr />
        <div className="upload-buttons">
          <button onClick={handleViewPhotosVideos}>Photos/Videos</button>
          <button onClick={handleViewThreads}>Threads</button>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
