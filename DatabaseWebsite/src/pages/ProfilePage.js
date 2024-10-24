import React, { useState, useEffect } from 'react';
import './ProfilePage.css'; 
import { useNavigate } from 'react-router-dom';
import { getUserPosts } from '../userData/userPosts';
import Post from '../components/Post'; 
import { getUserInfo, getUserFollowers, getUserFollowing } from '../userData/user'; // Update this to fetch followers/following data

function ProfilePage() {
  const [profile, setProfile] = useState({
    username: '',
    bio: '',
    totalPosts: 0,
    followers: 0, // Dynamically loaded
    following: 0, // Dynamically loaded
    isFollowing: false,
  });

  const [showModel, setShowModel] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  // Function to fetch and set user information
  const fetchUserInfo = async () => {
    // Fetch the user's posts and count them
    const posts = await getUserPosts();
    const num = posts.length;
    const userInfo = await getUserInfo(); // Get the user info from the function
    const followers = await getUserFollowers(); // Fetch number of followers
    const following = await getUserFollowing(); // Fetch number of following
     // If userInfo is successfully retrieved, update the profile state
    if (userInfo) {
      setProfile((prevProfile) => ({
        ...prevProfile,
        username: userInfo.username || 'No username', // Use the username or a default value
        bio: userInfo.profileBiography || 'No bio available',      // Use the bio or a default value
        totalPosts: num, // Update the post count
        followers: followers.length, // Set followers count
        following: following.length, // Set following count
      }));
    }
  };
  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
  }, []);

  // Fetch user posts when model is opened
  const handleViewPhotosVideos = async () => {
    console.log('Fetching photos/videos...');
    const posts = await getUserPosts(); // Fetch user posts
    setUserPosts(posts);
    setShowModel(true); // Show model
  };

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

  const handleCloseModel = () => {
    setShowModel(false); // Close model
  };

  const handleViewThreads = () => {
    // Logic for viewing user's threads to be implemented
    console.log('Viewing threads...');
  };

   // Navigate to the followers or following pages
   const handleViewFollowers = () => {
    navigate('/usersFollowers');
  };

  const handleViewFollowing = () => {
    navigate('/usersFollowing');
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
              <button onClick={handleViewFollowers}>
                <p>{profile.followers}</p>
                <p>Followers</p>
              </button>  
            </div>
            <div className="stat">
            <button onClick={handleViewFollowing}>
              <p>{profile.following}</p>
              <p>Following</p>
            </button>  
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
      {/* model popout for displaying user posts */}
      {showModel && (
        <div className="model-overlay" onClick={handleCloseModel}>
          <div className="model-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-model" onClick={handleCloseModel}>X</button>
            <div className="posts-scrollable">
            {userPosts.length > 0 ? (
          userPosts.map((post) => (
            <Post 
              key={post._id}
              creator={profile.username} 
              postDate={post.creationDate}
              postContent={post.textContent || 'No content available'}  // Only showing textContent for now
              postId={post._id}       // Passing the postID to the Post component
            />
          ))
        ) : (
                <p>No posts available.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
