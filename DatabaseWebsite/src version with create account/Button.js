// Button.js
import React, { useEffect, useState } from 'react';
import './Button.css'; // Import CSS file for button styling
import CreateAccountPopup from './CreateAccountPopup';


export const togglePopup = (isPopupOpen, setPopupOpen) => {
    setPopupOpen(!isPopupOpen);
  };

//listens for when the button is clicked
  export const handleClick = async (collectionName, setData, setCollection) => {
    //sends request to the URL for the user data
    const response = await fetch('http://98.80.48.42:3000/api/' + collectionName);
    const json = await response.json();
    console.log(json)
    //updates the data variable with fetched JSON data
    setData(json)
    setCollection(collectionName)
  };

function Button({togglePopup, handleClick}) {
  //describes what the component renders on the screen
  return (
    <div className="button-container">
      <button onClick={() => togglePopup()}>Create Account</button>
      <button onClick={() => handleClick('users')}>View Users</button>
    </div>
  );
}

export default Button;