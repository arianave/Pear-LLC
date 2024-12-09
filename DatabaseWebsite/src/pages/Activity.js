import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getFollowerRequests, acceptRequest, denyRequest, getUserInfo } from '../userData/user'; 
import '../CSS/Activity.css';
import '../CSS/FollowersPage.css';

function Activity() {
    const [showPopup, setShowPopup] = useState(false);
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
      try {
        const requestIds = await getFollowerRequests();
        
        // Fetch user info for each request
        const requestsData = await Promise.all(
          requestIds.map(async (id) => {
            const userInfo = await getUserInfo(id);
            return { ...userInfo, _id: id };
          })
        );
  
        setRequests(requestsData);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
  
    useEffect(() => {
      fetchRequests();
    }, []);
    
    const handlePopupToggle = () => {
        setShowPopup(!showPopup);
        if (!showPopup) fetchRequests();
    };
    
    const handleAccept = async (requestId) => {
        await acceptRequest(requestId);
        setRequests(requests.filter(request => request._id !== requestId));
    };
    
    const handleDeny = async (requestId) => {
        await denyRequest(requestId);
        setRequests(requests.filter(request => request._id !== requestId));
    };

    return (
        <div className='page-container'>
            <h1>Activity</h1>
            <button className="request-button" onClick={handlePopupToggle}>
        Follower Requests: {requests.length}
      </button>

      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <h2>Follower Requests: {requests.length}</h2>
            {requests.length === 0 ? (
              <p className="no-data-message">No Requests</p>
            ) : (
              <div className="requests-panel">
                {requests.map((request) => (
                  <div className="follower-card" key={request._id}>
                    <div className="follower-info">
                      <Link to={`/ProfilePage/${request._id}`} className="follower-link">
                        <p className="follower-username">{request.username}</p>
                        <p className="follower-name">{request.firstName + " " + request.lastName  || 'Unknown Name'}</p>
                      </Link>
                    </div>
                    <div className="action-buttons">
                      <button
                        className="accept-button"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept
                      </button>
                      <button
                        className="deny-button"
                        onClick={() => handleDeny(request._id)}
                      >
                        Deny
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="close-popup-button" onClick={handlePopupToggle}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Activity;
