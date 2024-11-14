import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomeFeed.css'; //importing the css

function HomeFeed() {
  const [posts, setPosts] = useState([]); // State for storing posts

  // Sample posts for demonstration (replace with actual data fetching)
  const samplePosts = [
    {
      id: 1,
      username: 'user1',
      profilePicture: 'https://via.placeholder.com/40',
      timestamp: '2 hours ago',
      content: 'This is a sample post.',
    },
    {
      id: 2,
      username: 'user2',
      profilePicture: 'https://via.placeholder.com/40',
      timestamp: '1 hour ago',
      content: 'Another sample post here!',
    },
  ];

  // Navigate to the activity page
  const handleActivityClick = () => {
    // You can use navigate here if you have a route for activity
    // navigate('/Activity');
    console.log('Navigating to Activity'); // Placeholder action
  };

  // Navigate to the column page
  const handleColumnClick = () => {
    // You can use navigate here if you have a route for column
    // navigate('/Column');
    console.log('Navigating to Column'); // Placeholder action
  };

  return (
    <div className="home-feed">
      <div className="header">
        <Link to="/Activity">
          <button className="activity-button">Activity</button>
        </Link>
        <Link to="/Column">
          <button className="column-button">Column</button>
        </Link>
        <Link to="/FeedSearch">
          <button className="search-button">🔍</button> {/* Search button */}
        </Link>
      </div>

      <div className="post-list">
        {posts.length === 0 ? (
          <p className="empty-feed">Feed is currently empty. Follow some other users to fill this page up!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <img src={post.profilePicture} alt="Profile" className="profile-picture" />
                <div className="post-user-info">
                  <p className="username">{post.username}</p>
                  <p className="timestamp">{post.timestamp}</p>
                </div>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-actions">
                <button className="upvote-button">👍</button>
                <button className="downvote-button">👎</button>
                <button className="comment-button">💬</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

}

export default HomeFeed;