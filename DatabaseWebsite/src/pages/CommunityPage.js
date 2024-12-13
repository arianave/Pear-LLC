import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/CommunityPage.css'; // Importing the CSS
import { getUserCommunity, getCommunityThreads, addThread, joinCommunity } from '../userData/userThreads';
import { getUsername, getUserId } from '../userData/user';

function CommunityPage() {
    const { communityId } = useParams(); // Extract community ID from the URL
    const [community, setCommunity] = useState(null);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [username, setUsername] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [threadContent, setThreadContent] = useState("");
    const [isJoined, setIsJoined] = useState(false);
    const [userID, setUserID] = useState("");

    // Fetch community details and threads on page load
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const communityDataArray = await getUserCommunity(communityId);
                const communityData = communityDataArray[0];

                if (communityData && communityData.threads) {
                    // Fetch threads using the array of thread IDs
                    const communityThreads = await getCommunityThreads(communityData.threads);
                    setThreads(communityThreads || []); // Set threads once they are fetched
                } else {
                    console.log('No threads found for this community'); // Log if no threads are found
                    setThreads([]); // Set empty threads if no threads exist
                }

                setCommunity(communityData);
                const userName = await getUsername(communityData.userID);
                console.log("Community Data: ", communityData);
                setUsername(userName);
                const userId = getUserId();
                setUserID(userId);
                setIsJoined(communityData.joins.includes(userId));

                setLoading(false);
                console.log("Community: ", community);
            } catch (error) {
                console.error("Error fetching community data:", error);
                setLoading(false);
            }
        }

        fetchData();
    }, [communityId]);

    useEffect(() => {
        console.log("Updated Community: ", community);
    }, [community]);

    const handleAddThread = async () => {
        try {
            addThread(communityId, threadContent);
            setThreadContent(""); // Clear input
            setIsModalOpen(false); // Close modal
        } catch (error) {
            console.error("Error adding thread:", error);
        }
    };

    const handleJoin = async () => {
        try {
            joinCommunity(communityId, userID);
            if (isJoined) {
                setIsJoined(true);
            } else {
                setIsJoined(false);
            }
        } catch (error) {
            console.error("Error joining community:", error);
        }
    };


    if (loading) {
        return <div className="page-container">Loading community details...</div>;
    }

    if (community === null) {
        return <div className="page-container">Community not found.</div>;
    }

    return (
        <div className="page-container">
            {/* Header Section */}
            <div className="community-header">
            {community ? (
                <>
                    <h1 className="community-title">{community.communityName}</h1>
                    <p className="community-description">{community.description || "No description provided"}</p>
                    <p className="community-creator">Created by: {username || "Unknown User"}</p>
                    <div>
                        {/* Add Thread Button */}
                        <button onClick={() => setIsModalOpen(true)}>Add Thread</button>

                        {/* Join Button */}
                        {community.userID !== userID && (
                            <button onClick={handleJoin}>
                                {isJoined ? "Joined" : "Join"}
                            </button>
                        )}
                    </div>
                </>
            ) : (
                <p>Loading community details...</p>
            )}
        </div>

            {/* Modal for Adding Thread */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Add a New Thread</h2>
                        <textarea
                            value={threadContent}
                            onChange={(e) => setThreadContent(e.target.value)}
                            placeholder="Enter your thread content..."
                        />
                        <div>
                            <button onClick={handleAddThread}>Submit</button>
                            <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Threads Section */}
            <div className="threads-section">
                <h2>Threads</h2>
                <div className="threads-container">
                    {threads.length > 0 ? (
                        threads.map((thread) => (
                            <div className="thread-card" key={thread._id}>
                                <h3 className="thread-title">{thread.title}</h3>
                                <p className="thread-snippet">{thread.content.slice(0, 100)}...</p>
                                <p className="thread-meta">Posted by {thread.creatorUsername || "Unknown"} on {new Date(thread.creationDate).toLocaleDateString()}</p>
                            </div>
                        ))
                    ) : (
                        <p>No threads found in this community.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CommunityPage;
