// Button.js
import React, { useEffect, useState } from 'react';
import './Button.css'; // Import CSS file for button styling

function Button() {
  //'data' empty array to store fetched data
  //'setData' updates data with new fetched info
  const [data, setData] = useState([]);
  //listens for when the button is clicked
  const handleClick = async () => {
    //sends request to the URL for the user data
    const response = await fetch('http://98.80.48.42:3000/api/users');
    const json = await response.json();
    console.log(json)
    //updates the data variable with fetched JSON data
    setData(json)

  };

  //describes what the component renders on the screen
  return (
    <div>  
      <button className="centered-button" onClick={handleClick}> 
        Click Me!
      </button> 
      <h1>Data from MongoDB</h1>
      <ul>
        {data.map(item => (
          <li key={item._id}>{item.name}, {item.age}, {item.email}</li> 
        ))}
      </ul>
    </div>
  );
}

export default Button;

