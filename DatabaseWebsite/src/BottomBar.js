import React from 'react';
import { Link } from 'react-router-dom';
import './BottomBar.css'; // CSS for the bottom bar
import { getUserId } from './userData/user';

function BottomBar() {
  const userId = getUserId();

  return (
    <div className="bottom-bar">
        {/* Need to include feed button and message button once implemented */}
         {/* Using link here instead of a will allower more usability as it disables full page reload*/}
      <Link to="/HomeFeed">Feed</Link>
      <Link to="/PostCreation">Post</Link>
      <Link to="/Messages">Message</Link>  
      <Link to={`/ProfilePage/${userId}`}>Profile</Link>
    </div>
  );
}

export default BottomBar;
