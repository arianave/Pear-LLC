import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { getUserFollowing, unfollowUser } from '../userData/user'; // API functions
import './ProfilePage.css'; // Reuse profile styles

function UsersFollowing() {
  const { userId } = useParams();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      const userFollowing = await getUserFollowing(userId);
      setFollowing(userFollowing);
    };

    fetchFollowing();
  }, []);

  const handleUnfollow = async (userId) => {
    await unfollowUser(userId);
    setFollowing(following.filter(follow => follow._id !== userId)); // Remove from list
  };

  return (
    <div className="profile-container">
      <h1>Following</h1>
      <ul>
        {following.map((follow) => (
          <li key={follow._id}>
          <Link to={`/ProfilePage/${follow._id}`} className="follower-link">
            {follow.username}
          </Link>
          <button onClick={() => handleUnfollow(follow._id)}>Unfollow</button>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default UsersFollowing;
