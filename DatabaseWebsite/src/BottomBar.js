import React from 'react';
import './BottomBar.css'; // CSS for the bottom bar

function BottomBar() {
  return (
    <div className="bottom-bar">
        {/* Need to include feed button and message button once implemented */}
      <a href="/PostCreation">Post</a>
      <a href="/LogInPage">Login</a>
      <a href="/ProfilePage">Profile</a>
    </div>
  );
}

export default BottomBar;
