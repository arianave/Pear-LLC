import React from 'react';
import { Link } from 'react-router-dom';
import './BottomBar.css'; // CSS for the bottom bar
import { getUserId } from './userData/user';

//import icons
import feedIcon from "./Icons/feedIcon.png";
import messageIcon from "./Icons/messageIcon.png";
import profileIcon from "./Icons/profileIcon.png";
import postIcon from "./Icons/postIcon.png";

function BottomBar() {
  const userId = getUserId();

  return (
    <div className="bottom-bar">
        {/* Need to include feed button and message button once implemented */}
         {/* Using link here instead of a will allower more usability as it disables full page reload*/}
      <Link to="/HomeFeed">
        <img src={feedIcon} alt="Feed" className="bottom-bar-icon" />
      </Link>
      <Link to="/PostCreation">
        <img src={postIcon} alt="post" className="post-icon" />
      </Link>
      <Link to="/Messages">
        <img src={messageIcon} alt="message" className="message-icon" />
      </Link>
      <Link to={`/ProfilePage/${userId}`}>
        <img src={profileIcon} alt="profile" className="profile-icon" />
      </Link>
    </div>
  );
}

export default BottomBar;
