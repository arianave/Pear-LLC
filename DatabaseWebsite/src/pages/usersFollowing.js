import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserFollowing, unfollowUser } from '../userData/user'; // API functions
import '../CSS/ProfilePage.css'; // Reuse profile styles
import '../CSS/FollowersPage.css'; // Reuse styles for followers layout

function UsersFollowing() {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const userFollowing = await getUserFollowing(userId);
      setFollowing(userFollowing);
    };

    fetchFollowing();
  }, [userId]);

  const handleUnfollow = async (followId) => {
    await unfollowUser(followId);
    setFollowing(following.filter(follow => follow._id !== followId)); // Remove from the list
  };

  return (
    <div className="followers-page">
      <h1>Following</h1>
      {following.length === 0 ? (
        <p className="no-data-message">Not Following Anyone</p>
      ) : (
        <div className="followers-panel">
          {following.map((follow) => (
            <div className="follower-card" key={follow._id}>
              <div className="follower-info">
                <Link to={`/ProfilePage/${follow._id}`} className="follower-link">
                  <p className="follower-username">{follow.username}</p>
                  <p className="follower-name">{follow.name || 'Unknown Name'}</p>
                </Link>
              </div>
              <button
                className="unfollow-button"
                onClick={() => handleUnfollow(follow._id)}
              >
                Unfollow
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UsersFollowing;
