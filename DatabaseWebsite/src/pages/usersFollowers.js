import React, { useState, useEffect } from 'react';
import { getUserFollowers, removeUserFromFollowing } from '../userData/user'; // API functions
import './ProfilePage.css'; // Reuse profile styles

function UsersFollowers() {
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      const userFollowers = await getUserFollowers();
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
            {follower.username}
            <button onClick={() => handleUnfollow(follower._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersFollowers;