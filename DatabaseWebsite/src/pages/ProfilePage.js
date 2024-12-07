import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/ProfilePage.css'; 
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserPosts } from '../userData/userPosts';
import Post from '../components/Post'; 
import { getUserInfo, getUserFollowers, getUserFollowing, getUserId, unfollowUser, followUser, removeUserId, changeRequest } from '../userData/user'; // Update this to fetch followers/following data
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

function ProfilePage() {
  const { userId } = useParams(); // Get userId from the URL
  const [profile, setProfile] = useState({
    userId: '',
    username: '',
    bio: '',
    totalPosts: 0,
    followers: 0, // Dynamically loaded
    following: 0, // Dynamically loaded
    isFollowing: false,
    isPrivate: false,
    requests: [],
    hasRequested: false,
  });

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  // Function to fetch and set user information
  const fetchUserInfo = async () => {
    // Fetch the user's posts and count them
    const posts = await getUserPosts(userId);
    const num = posts ? posts.length : 0; // Set num to 0 if posts is undefined or null (mod for unit test)
    const userInfo = await getUserInfo(userId); // Get user info from function
    const followers = await getUserFollowers(userId).catch((err) => {
      console.error('Failed to fetch followers:', err);
      return [];
    });
    const following = await getUserFollowing(userId).catch((err) => {
      console.error('Failed to fetch following:', err);
      return [];
    });


     // If userInfo is successfully retrieved, update the profile state
    if (userInfo) {
      const currentUserId = getUserId(); // Get the current logged-in user's ID
      setIsCurrentUser(userId === currentUserId); // Check if the profile belongs to the current user
      let isFollowingCurrentUser = null;
      if(!isCurrentUser){
        isFollowingCurrentUser = followers.some(follower => follower._id === currentUserId);
        console.log('Is follwing current user: ', isFollowingCurrentUser);
      }
      let hasRequestedFollow = userInfo.requests?.some(request => request === currentUserId);

      setProfile((prevProfile) => ({
        ...prevProfile,
        userId: userInfo.userId,
        username: userInfo.username || 'No username', // Use the username or a default value
        bio: userInfo.profileBiography || 'No bio yet',      // Use the bio or a default value
        totalPosts: num, // Update the post count
        followers: followers.length, // Set followers count
        following: following.length, // Set following count
        isFollowing: isFollowingCurrentUser,
        isPrivate: userInfo.isPrivate,
        requests: userInfo.requests,
        hasRequested: hasRequestedFollow,
      }));
    }
  };
  useEffect(() => {
    fetchUserInfo(); // Fetch user info when the component mounts
  }, [userId]);

  // Fetch user posts when model is opened
  const handleViewPhotosVideos = async () => {
    console.log('Fetching photos/videos...');
    const posts = await getUserPosts(userId); // Fetch user posts
    setUserPosts(posts);
    setShowModel(true); // Show model
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    navigate('/EditProfile');
  };

  const handleLogout = () => {
    console.log('Logging out');
    removeUserId();
    navigate('/LogInPage');
  };

  const handleFollowUnfollow = async () => {
    try {
      if (profile.isFollowing) {
        // Unfollow the user if already following
        const success = await unfollowUser(userId);
        if (success) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            isFollowing: false,
            followers: prevProfile.followers - 1,
          }));
        }
      } else if (profile.isPrivate) {
        handleRequest();
      } else {
        // Follow the user if not following
        const success = await followUser(userId);
        if (success) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            isFollowing: true,
            followers: prevProfile.followers + 1,
          }));
        }
      }
    } catch (error) {
      console.error('Error toggling follow state:', error);
    }
  };

  const handleCloseModel = () => {
    setShowModel(false); // Close model
  };

  const handleViewThreads = () => {
    // Logic for viewing user's threads to be implemented
    console.log('Viewing threads...');
  };

  const handleRequest = async () => {
    try {
      const success = await changeRequest(userId); // Call the backend function to add a request
      if (success) {
        if (!profile.hasRequested) {
          setProfile((prevProfile) => ({
            ...prevProfile,
            hasRequested: true, // Mark the request as sent
          }));
        } else {
          setProfile((prevProfile) => ({
            ...prevProfile,
            hasRequested: false, // Mark the request as sent
          }));
        }
      }
    } catch (error) {
      console.error('Error sending follow request:', error);
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>{profile.username}</h1>
        {isCurrentUser && (
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      )}
      </div>

      <div className="profile-body">
        <div className="profile-picture">
          <img src="/gray_pfp.png" alt="Anonymous user" className="avatar" />
        </div>
        <div className="profile-info">
          <p>{profile.bio}</p>
          {!profile.isPrivate || profile.isFollowing || isCurrentUser ? (
            <>
              <div className="profile-stats">
                <div className="stat">
                  <p>{profile.totalPosts}</p>
                  <p>Posts</p>
                </div>
                <div className="stat">
                  <p>
                    <Link to={`/usersFollowers/${userId}`} className="number-link">
                      {profile.followers}
                    </Link>
                  </p>
                  <p>Followers</p>
                </div>
                <div className="stat">
                  <p>
                    <Link to={`/usersFollowing/${userId}`} className="number-link">
                      {profile.following}
                    </Link>
                  </p>
                  <p>Following</p>
                </div>
              </div>

              {isCurrentUser ? (
                <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
              ) : (
                <button className="follow-button" onClick={handleFollowUnfollow}>
                  {profile.isFollowing ? 'Unfollow' : 'Follow'}
                </button>
              )}
            </>
          ) : (
            !isCurrentUser && (
              <button className="follow-button" onClick={handleFollowUnfollow}>
                {profile.hasRequested ? 'Requested' : 'Follow'}
              </button>
            )
          )}
        </div>
      </div>

      {!profile.isPrivate || profile.isFollowing || isCurrentUser ? (
        <div className="profile-uploads-section">
          <hr />
          <div className="upload-buttons">
            <button onClick={handleViewPhotosVideos}>Photos/Videos</button>
            <button onClick={handleViewThreads}>Threads</button>
          </div>
        </div>
      ) : null}

      {showModel && (
        <div className="model-overlay" onClick={handleCloseModel}>
          <div className="model-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-model" onClick={handleCloseModel}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="posts-scrollable">
              {userPosts.length > 0 ? (
                [...userPosts]
                  .sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
                  .map((post) => (
                    <Post
                      key={post._id}
                      creator={profile.username}
                      postDate={post.creationDate}
                      postContent={post.textContent || 'No content available'}
                      postId={post._id}
                      mediaType={post.mediaType} // Pass media type
                      mediaUrl={post.mediaUrl}
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