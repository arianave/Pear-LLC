import React, { useState, useEffect } from "react";
import "./Post.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUp,
  faArrowDown,
  faTimes,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import {
  getPostComments,
  addComment,
  upvotePost,
  downvotePost,
  getPostVoteCount,
  checkIfUserHasVoted,
} from "../userData/postComments";
import { getUserId, getUsername } from "../userData/user";
import { getUserCommunity } from "../userData/userThreads";
import { Link } from "react-router-dom";

function Post({ creator, postDate, postContent, postId, mediaType, mediaUrl, communityID = null }) {
  const [comments, setComments] = useState([]);
  const [votesCount, setVotesCount] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [hasUpvoted, setUpvote] = useState(false);
  const [hasDownvoted, setDownvote] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [community, setCommunity] = useState(null);
  const userId = getUserId();

  useEffect(() => {
    const fetchCommunity = async () => {
      const communityData = await getUserCommunity(communityID);
      const communityObject = communityData[0];
      setCommunity(communityObject);
    }

    // Function to fetch votes
    const fetchVotes = async () => {
      const initialVoteCount = await getPostVoteCount(postId);
      if (initialVoteCount !== null) {
        setVotesCount(initialVoteCount);
      }

      // Check if user has already voted on this post
      const userHasVoted = await checkIfUserHasVoted(postId, userId);
      if (userHasVoted.hasVoted) {
        if (userHasVoted.voteType === "upvote") {
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

    // Function to fetch comments and their usernames
    const fetchComments = async () => {
      const postComments = await getPostComments(postId);

      // Fetch usernames for each comment
      const commentsWithUsernames = await Promise.all(
        postComments.map(async (comment) => {
          const username = await getUsername(comment.userID); // Retrieve username for userID
          return { ...comment, username }; // Add username to comment data
        })
      );

      setComments(commentsWithUsernames);
    };

    if (postId) {
      fetchVotes(); // Always fetch votes when postId changes

      if(communityID){
        fetchCommunity();
      }

      if (isExpanded) {
        fetchComments(); // Fetch comments only if the post is expanded
      }
    }
  }, [postId, isExpanded]);

  const handleUpvote = async () => {
    if (hasUpvoted) {
      // User is removing their upvote
      setUpvote(false);
    } else {
      // User is either switching from downvote or casting an upvote for the first time
      setUpvote(true);
      setDownvote(false);
    }
    const updatedVotes = await upvotePost(postId, userId);
    setVotesCount(updatedVotes);
  };

  const handleDownvote = async () => {
    if (hasDownvoted) {
      // User is removing their downvote
      setDownvote(false);
    } else {
      // User is either switching from upvote or casting a downvote for the first time
      setDownvote(true);
      setUpvote(false);
    }
    const updatedVotes = await downvotePost(postId, userId);
    setVotesCount(updatedVotes);
  };

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const addedComment = await addComment(userId, postId, newComment);
        const username = await getUsername(userId);
        const commentWithUsername = {
          ...addedComment,
          username: username,
        };
        setComments((prevComments) => [...prevComments, commentWithUsername]);
        setNewComment(""); // Clear input field after adding comment
      } catch (error) {
        console.error("Error adding comment:", error);
      }
    }
  };

  return (
    <>
      {/* Compact View */}
      <div className="post-compact" onClick={() => setIsExpanded(true)}>
        <div className="post-header">
          <h4 className="post-creator">{creator}</h4>
          {community && (
            <p className="thread-arrow">
              <FontAwesomeIcon icon={faPlay} />
              <Link
                  to={`/CommunityPage/${community._id}`}
                  onClick={(e) => e.stopPropagation()}
                  key={community._id}
                  className="community-link"
              >
                  <p>{community.communityName}</p>
              </Link>
            </p>
          )}
          <p className="post-date">{new Date(postDate).toLocaleDateString()}</p>
        </div>
        {mediaType && mediaUrl && (
          <>
          <div className="post-media">
            {mediaType === "image" && <img src={mediaUrl} alt="Post media" />}
            {mediaType === "video" && (
              <video controls>
                <source src={mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
          <hr />
          </>
        )}
        <div className="post-content-layout">
          <p className="post-content">{postContent}</p>
        </div>
        <div className="post-votes">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleUpvote();
            }}
            className={hasUpvoted ? "upvote active" : "upvote"}
          >
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <span>{votesCount}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDownvote();
            }}
            className={hasDownvoted ? "downvote active" : "downvote"}
          >
            <FontAwesomeIcon icon={faArrowDown} />
          </button>
        </div>
      </div>

      {/* Expanded Popout */}
      {isExpanded && (
        <div className="post-popout">
          <div
            className="popout-overlay"
            onClick={() => setIsExpanded(false)}
          ></div>
          <div className="popout-content">
            <button className="close-btn" onClick={() => setIsExpanded(false)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <div className="post-left-panel">
              <div className="post-header">
                <h4 className="post-creator">{creator}</h4>
                <p className="post-date">
                  {new Date(postDate).toLocaleDateString()}
                </p>
              </div>
              <div className="post-content">
                {postContent ? (
                  <p>{postContent}</p>
                ) : (
                  <p>No content available</p>
                )}
              </div>
              {mediaType && mediaUrl && (
                <div className="post-media">
                  {mediaType === "image" && (
                    <img src={mediaUrl} alt="Post media" />
                  )}
                  {mediaType === "video" && (
                    <video controls>
                      <source src={mediaUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              )}
              <div className="post-votes">
                <button
                  onClick={handleUpvote}
                  className={hasUpvoted ? "upvote active" : "upvote"}
                >
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <span>{votesCount}</span>
                <button
                  onClick={handleDownvote}
                  className={hasDownvoted ? "downvote active" : "downvote"}
                >
                  <FontAwesomeIcon icon={faArrowDown} />
                </button>
              </div>
            </div>
            <div className="post-right-panel">
              <div className="post-comments">
                <h5>Comments:</h5>
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment">
                      <p className="comment-user">
                        <strong>{comment.username}:</strong>
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
              <div className="add-comment">
                <textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button onClick={handleAddComment}>Add Comment</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Post;
