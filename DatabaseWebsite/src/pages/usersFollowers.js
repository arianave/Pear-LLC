import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserFollowers, removeUserFromFollowing } from '../userData/user'; // API functions
import './ProfilePage.css'; // Reuse profile styles

function UsersFollowers() {
  const { userId } = useParams();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userFollowers = await getUserFollowers(userId);
      setFollowers(userFollowers);
    };

    fetchFollowers();
  }, []);

  const handleUnfollow = async (userId) => {
    await removeUserFromFollowing(userId);
    setFollowers(followers.filter(follower => follower._id !== userId)); // Remove from the list
  };

  return (
    <div className="profile-container">
      <h1>Followers</h1>
      <ul>
      {followers.map((follower) => (
          <li key={follower._id}>
            {/* Link to the profile page with the follower's userId */}
            <Link to={`/ProfilePage/${follower._id}`} className="follower-link">
              {follower.username}
            </Link>
            <button onClick={() => handleUnfollow(follower._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersFollowers;