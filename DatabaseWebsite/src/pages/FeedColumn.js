import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../CSS/FeedColumn.css'; //importing the css
import { getUserCommunities, getUserJoinedCommunities } from '../userData/userThreads';
import { getUserId } from '../userData/user';

function FeedColumn() {
const [UserCommunities, setUserCommunities] = useState([]);
const [JoinedCommunities, setJoinedCommunities] = useState([]);

useEffect(() => {
    async function fetchCommunities() {
        try {
            // Fetch user-created communities and joined communities
            const userID = getUserId();
            const userCommunities = await getUserCommunities(userID);
            const joinedCommunities = await getUserJoinedCommunities(userID);

            // Update state with fetched data
            setUserCommunities(userCommunities || []);
            setJoinedCommunities(joinedCommunities || []);
        } catch (error) {
            console.error("Error fetching communities:", error);
        }
    }

    fetchCommunities();
}, []);

    return (
        <div className="page-container">
            <h1>Communities</h1>
            
            {/* Section for user's communities */}
            <div className="section">
                <h2>Your Communities</h2>
                <div className="community-container">
                    {UserCommunities.length > 0 ? (
                        UserCommunities.map((community) => (
                            <Link 
                                to={`/CommunityPage/${community._id}`} 
                                key={community._id} 
                                className="community-card"
                            >
                                <p className="community-name">{community.communityName}</p>
                                <p className="community-description">{community.description || "No description provided"}</p>
                            </Link>
                        ))
                    ) : (
                        <p>No communities found</p>
                    )}
                </div>
            </div>

            {/* Section for joined communities */}
            <div className="section">
                <h2>Joined Communities</h2>
                <div className="community-container">
                    {JoinedCommunities.length > 0 ? (
                        JoinedCommunities.map((community) => (
                            <Link 
                                to={`/CommunityPage/${community._id}`} 
                                key={community._id} 
                                className="community-card"
                            >
                                <p className="community-name">{community.communityName}</p>
                                <p className="community-description">{community.description || "No description provided"}</p>
                            </Link>
                        ))
                    ) : (
                        <p>No communities found</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default FeedColumn;
