import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/HomeFeed.css'; //importing the css
import Post from '../components/Post'; // Import the Post component
import { useEffect } from 'react';
import { getUserId } from '../userData/user';
import getServerURL from './serverURL';


function HomeFeed() {
  const [posts, setPosts] = useState([]); // State for storing posts

  useEffect(() => {
    const fetchPosts = async () => {
        const userId = getUserId();
        try {
            const response = await fetch(`${getServerURL()}/getFollowedPosts/${userId}`);
            const data = await response.json();
            if (data.success) {
                console.log('Fetched posts:', data.posts); // Debug log
                setPosts(data.posts);
            } else {
                console.error('Failed to fetch followed posts:', data.message);
            }
        } catch (error) {
            console.error('Error fetching followed posts:', error);
        }
    };

    fetchPosts();
}, []);

  return (
    <div className="home-feed">
      <div className="header">
        <Link to="/Activity">
          <button className="activity-button">Activity</button>
        </Link>
        <Link to="/FeedColumn">
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
            <Post
              key={post._id}
              creator={post.username}
              postDate={post.creationDate}
              postContent={post.textContent || 'No content available'}
              mediaUrl={post.mediaUrl}
              mediaType={post.mediaType}
              postId={post._id}
            />

          ))
        )}
      </div>
    </div>
  );

}

export default HomeFeed;