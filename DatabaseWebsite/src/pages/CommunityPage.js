import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../CSS/CommunityPage.css'; // Importing the CSS
import { getUserCommunity, getCommunityThreads } from '../userData/userThreads';

function CommunityPage() {
    const { communityId } = useParams(); // Extract community ID from the URL
    const [community, setCommunity] = useState(null);
    const [threads, setThreads] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch community details and threads on page load
    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const communityData = await getUserCommunity(communityId);

                if (communityData && communityData.threads) {
                    // Fetch threads using the array of thread IDs
                    const communityThreads = await getCommunityThreads(communityData.threads);
                    setThreads(communityThreads || []); // Set threads once they are fetched
                } else {
                    console.log('No threads found for this community'); // Log if no threads are found
                    setThreads([]); // Set empty threads if no threads exist
                }

                setCommunity(communityData[0]);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching community data:", error);
                setLoading(false);
            }
        }

        fetchData();
    }, [communityId]);

    if (loading) {
        return <div className="page-container">Loading community details...</div>;
    }

    if (!community) {
        return <div className="page-container">Community not found.</div>;
    }

    console.log("Community data after: ", community);

    return (
        <div className="page-container">
            {/* Header Section */}
            <div className="community-header">
            {community ? (
                <>
                    <h1 className="community-title">{community.communityName}</h1>
                    <p className="community-description">{community.description || "No description provided"}</p>
                    <p className="community-creator">Created by: {community.creatorUsername || "Unknown User"}</p>
                </>
            ) : (
                <p>Loading community details...</p>
            )}
        </div>

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
