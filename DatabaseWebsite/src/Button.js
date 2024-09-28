// Button.js
import React from 'react';
import './Button.css'; // Import CSS file for button styling

function Button({handleClick, buttonText}) {
  //describes what the component renders on the screen
  return (
    <div className="button-container">
      <button onClick={() => handleClick('users')}>{buttonText}</button>
    </div>
  );
}

export default Button;