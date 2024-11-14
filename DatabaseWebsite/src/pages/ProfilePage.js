import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ProfilePage.css'; 
import { useNavigate } from 'react-router-dom';
import { getUserPosts } from '../userData/userPosts';
import Post from '../components/Post'; 
import { getUserInfo, getUserFollowers, getUserFollowing, getUserId, unfollowUser, followUser} from '../userData/user'; // Update this to fetch followers/following data

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
  });

  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [userPosts, setUserPosts] = useState([]);

  const navigate = useNavigate();

  // Function to fetch and set user information
  const fetchUserInfo = async () => {
    // Fetch the user's posts and count them
    const posts = await getUserPosts(userId);
    const num = posts.length;
    const userInfo = await getUserInfo(userId); // Get the user info from the function
    const followers = await getUserFollowers(userId); // Fetch number of followers
    const following = await getUserFollowing(userId); // Fetch number of following
     // If userInfo is successfully retrieved, update the profile state
    if (userInfo) {
      const currentUserId = getUserId(); // Get the current logged-in user's ID
      setIsCurrentUser(userId === currentUserId); // Check if the profile belongs to the current user
      let isFollowingCurrentUser = null;
      if(!isCurrentUser){
        isFollowingCurrentUser = followers.some(follower => follower._id === currentUserId);
        console.log('Is follwing current user: ', isFollowingCurrentUser);
      }
      setProfile((prevProfile) => ({
        ...prevProfile,
        userId: userInfo.userId,
        username: userInfo.username || 'No username', // Use the username or a default value
        bio: userInfo.profileBiography || 'No bio available',      // Use the bio or a default value
        totalPosts: num, // Update the post count
        followers: followers.length, // Set followers count
        following: following.length, // Set following count
        isFollowing: isFollowingCurrentUser,
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
    navigate('/EditProfile'); //Edit profile page doesnt yet exist
  };

  const handleLogout = () => {
    console.log('Logging out');
    // Logic for logging out the user to be implemented 
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

   // Navigate to the followers or following pages
   const handleViewFollowers = () => {
    navigate(`/usersFollowers/${userId}`);
  };

  const handleViewFollowing = () => {
    navigate(`/usersFollowing/${userId}`);
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
          <div className="profile-stats">
            <div className="stat">
              <p>{profile.totalPosts}</p>
              <p>Posts</p>
            </div>
            <div className="stat">
              <button className = "view-followers" onClick = {handleViewFollowers}> 
              {/* Changed into an actual button */}
                <p>{profile.followers}</p>
                <p>Followers</p>
              </button>
            </div>
            <div className="stat">
            <button className = "view-following" onClick = {handleViewFollowing}> 
              {/* Changed into an actual button */}
                <p>{profile.following}</p>
                <p>Following</p>
              </button>
            </div>
          </div>

          {isCurrentUser ? (
            <button className="edit-profile-button" onClick={handleEditProfile}>Edit Profile</button>
          ) : (
            <button className="follow-button" onClick={handleFollowUnfollow}>
              {profile.isFollowing ? 'Unfollow' : 'Follow'}
            </button>
          )}
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