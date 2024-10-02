import React from 'react';
import './BottomBar.css'; // CSS for the bottom bar

function BottomBar() {
  return (
    <div className="bottom-bar">
        {/* Other links will be placed but these are an example */}
      <a href="/ProfilePage">Profile</a>
      <a href="/CreateAccountPage">Create Account</a>
      <a href="/LogInPage">Login</a>
    </div>
  );
}

export default BottomBar;
