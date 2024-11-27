import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserFollowers, removeUserFromFollowing, getName } from '../userData/user'; // API functions
import '../CSS/ProfilePage.css'; // Reuse profile styles
import '../CSS/FollowersPage.css'; // New styles for followers layout

function UsersFollowers() {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userFollowers = await getUserFollowers(userId);

      const followersWithNames = await Promise.all(
        userFollowers.map(async (follower) => {
          const fullName = await getName(follower._id); // Assuming getName takes a userId and returns the full name
          return { ...follower, fullName }; // Add fullName as a new attribute
        })
      );

      setFollowers(followersWithNames);
    };

    fetchFollowers();
  }, [userId]);

  const handleUnfollow = async (followerId) => {
    await removeUserFromFollowing(followerId);
    setFollowers(followers.filter(follower => follower._id !== followerId)); // Remove from the list
  };

  return (
    <div className="followers-page">
      <h1>Followers</h1>
      {followers.length === 0 ? (
        <p className="no-data-message">No Followers</p>
      ) : (
        <div className="followers-panel">
          {followers.map((follower) => (
            <div className="follower-card" key={follower._id}>
              <div className="follower-info">
                <Link to={`/ProfilePage/${follower._id}`} className="follower-link">
                  <p className="follower-username">{follower.username}</p>
                  <p className="follower-name">{follower.fullName || 'Unknown Name'}</p>
                </Link>
              </div>
              <button
                className="unfollow-button"
                onClick={() => handleUnfollow(follower._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersFollowers;
