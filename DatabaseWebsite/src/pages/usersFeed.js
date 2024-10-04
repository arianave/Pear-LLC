import React, { useState, useEffect } from 'react';
import { getUserId } from '../userData/user'; // Function to get current logged-in user ID
import './userFeed.css'; // Importing the CSS file for styling

const UsersFeed = () => {
    const [posts, setPosts] = useState([]);
    const [isEmpty, setIsEmpty] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            const userId = getUserId();

            try {
                // Fetch posts from users that the logged-in user is following
                const response = await fetch(`/api/getFollowedPosts/${userId}`);
                const data = await response.json();

                if (data.posts && data.posts.length > 0) {
                    setPosts(data.posts);
                } else {
                    setIsEmpty(true);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="feed-container">
            {/* Header with search, threads, and activity buttons */}
            <div className="header">
                <h2>Home</h2>
                <div className="header-icons">
                    <button className="icon-button search-btn" onClick={() => window.location.href='/search'}>🔍</button>
                    <button className="icon-button threads-btn" onClick={() => window.location.href='/threads'}>📚</button>
                    <button className="icon-button activity-btn" onClick={() => window.location.href='/activity'}>🔔</button>
                </div>
            </div>

            {/* Posts feed */}
            <div className="post-list">
                {isEmpty ? (
                    <div className="empty-feed">
                        <p>Feed is currently empty. Follow some other users to fill this page up!</p>
                    </div>
                ) : (
                    posts.map((post) => (
                        <div className="post" key={post._id}>
                            <div className="post-header">
                                <img className="profile-pic" src={post.user.profilePic} alt="profile" />
                                <div className="post-info">
                                    <h3>{post.user.username}</h3>
                                    <p className="time-stamp">{post.createdAt}</p>
                                </div>
                            </div>
                            <img className="post-image" src={post.imageURL} alt="post" />
                            <div className="post-actions">
                                <button className="upvote-btn" onClick={() => handleUpvote(post._id)}>👍 {post.upvotes}</button>
                                <button className="downvote-btn" onClick={() => handleDownvote(post._id)}>👎 {post.downvotes}</button>
                                <button className="comment-btn" onClick={() => handleComment(post._id)}>💬 Comments</button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Bottom navigation bar */}
            <div className="bottom-bar">
                <button className="nav-btn" onClick={() => window.location.href='/home'}>🏠</button>
                <button className="nav-btn" onClick={() => window.location.href='/search'}>🔍</button>
                <button className="nav-btn" onClick={() => window.location.href='/threads'}>📚</button>
                <button className="nav-btn" onClick={() => window.location.href='/activity'}>🔔</button>
            </div>
        </div>
    );
};

export default UsersFeed;
