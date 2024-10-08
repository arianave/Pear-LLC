import React from 'react';
import { Link } from 'react-router-dom';
import './BottomBar.css'; // CSS for the bottom bar

function BottomBar() {
  return (
    <div className="bottom-bar">
        {/* Need to include feed button and message button once implemented */}
         {/* Using link here instead of a will allower more usability as it disables full page reload*/}
      <Link to="/Feed">Feed</Link>
      <Link to="/PostCreation">Post</Link>
      <Link to="/Messages">Message</Link>  
      <Link to="/LogInPage">Login</Link>
      <Link to="/ProfilePage">Profile</Link>

    </div>
  );
}

export default BottomBar;
