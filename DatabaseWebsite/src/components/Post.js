import React from 'react';
import './Post.css';

function Post({ creator, postDate, postType, postContent, upvotes, downvotes, onUpvote, onDownvote, comments }) {
  return (
    <div className="post-container">
      {/* Post header */}
      <div className="post-header">
        <h4>{creator}</h4>
        <p>{new Date(postDate).toLocaleDateString()}</p>
      </div>

      {/* Post content based on type */}
      <div className="post-content">
        {postType === 'text' && <p>{postContent}</p>}
        {postType === 'picture' && <img src={postContent} alt="Post content" />}
        {postType === 'video' && (
          <video controls>
            <source src={postContent} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {postType === 'thread' && <p><strong>Thread: </strong>{postContent}</p>}
      </div>

      {/* Upvote/Downvote section */}
      <div className="post-votes">
        <button onClick={onUpvote}>Upvote ({upvotes})</button>
        <button onClick={onDownvote}>Downvote ({downvotes})</button>
      </div>

      {/* Comments section */}
      <div className="post-comments">
        <h5>Comments:</h5>
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        {/* Add a form here for adding new comments */}
      </div>
    </div>
  );
}

export default Post;
