import React, { useState, useEffect } from 'react';
import './Post.css';
import { getPostComments, addComment, upvotePost, downvotePost, getPostVoteCount, checkIfUserHasVoted } from '../userData/postComments';
import { getUserId } from '../userData/user';

function Post({ creator, postDate, postContent, postId }) {
  const [comments, setComments] = useState([]);
  const [votesCount, setVotesCount] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [hasUpvoted, setUpvote] = useState(false);
  const [hasDownvoted, setDownvote] = useState(false);
  const userId = getUserId();

  // Fetch comments and initial vote count when the component mounts
  useEffect(() => {
    const fetchCommentsAndVotes = async () => {
      const postComments = await getPostComments(postId);
      setComments(postComments);

      const initialVoteCount = await getPostVoteCount(postId);
      if (initialVoteCount !== null) {
        setVotesCount(initialVoteCount);
      }

    // Check if user has already voted on this post
    const userId = getUserId();
    const userHasVoted = await checkIfUserHasVoted(postId, userId);
    if (userHasVoted.hasVoted) {
      if (userHasVoted.voteType === 'upvote') {
        setUpvote(true);
        setDownvote(false);
      } else {
        setDownvote(true);
        setUpvote(false);
      }
    } else {
      setUpvote(false);
      setDownvote(false);
    }
  };

    if (postId) {
      fetchCommentsAndVotes();
    }
  }, [postId]);

  const handleUpvote = async () => {
    const updatedVotes = await upvotePost(postId, userId);
    setVotesCount(updatedVotes);
  };

  const handleDownvote = async () => {
    const updatedVotes = await downvotePost(postId, userId);
    setVotesCount(updatedVotes);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      const userID = getUserId();
      const addedComment = await addComment(userID, postId, newComment);
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment(''); // Clear input field after adding comment
    }
  };

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

      {/* Voting section */}
      <div className="post-votes">
        <button onClick={handleUpvote}>Upvote</button>
        <span>{votesCount}</span>
        <button onClick={handleDownvote}>Downvote</button>
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

      {/* New comment input */}
      <div className="add-comment">
        <textarea
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        ></textarea>
        <button onClick={handleAddComment}>Add Comment</button>
      </div>
    </div>
  );
}

export default Post;
