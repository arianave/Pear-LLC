import React, { useState, useEffect } from 'react';
import './Post.css';
import { getPostComments } from '../userData/postComments';

function Post({ creator, postDate, postContent, postId }) {
  const [comments, setComments] = useState([]);

  // Fetch comments when the component mounts
  useEffect(() => {
    const fetchComments = async () => {
      const postComments = await getPostComments(postId);
      setComments(postComments);
    };

    if (postId) {
      fetchComments();
    }
  }, [postId]);

  return (
    <div className="post-container">
      {/* Post header */}
      <div className="post-header">
        <h4 className="post-creator">{creator}</h4>
        <p className="post-date">{new Date(postDate).toLocaleDateString()}</p>
      </div>

      {/* Post content */}
      <div className="post-content">
        {postContent ? <p>{postContent}</p> : <p>No content available</p>}
      </div>

      {/* Comments section */}
      <div className="post-comments">
        <h5>Comments:</h5>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <p className="comment-user">
                <strong>{comment.userID}:</strong>
              </p>
              <p className="comment-content">{comment.content}</p>
              <p className="comment-timestamp">
                {new Date(comment.timestamp).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet.</p>
        )}
      </div>
    </div>
  );
}

export default Post;
