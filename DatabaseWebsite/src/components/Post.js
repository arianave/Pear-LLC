import React from 'react';
import './Post.css';

function Post({ creator, postDate, postContent }) {
  return (
    <div className="post-container">
      {/* Post header */}
      <div className="post-header">
        <h4>{creator}</h4>
        <p>{new Date(postDate).toLocaleDateString()}</p>
      </div>

      {/* Post content */}
      <div className="post-content">
        {postContent ? <p>{postContent}</p> : <p>No content available</p>}
      </div>
    </div>
  );
}

export default Post;
