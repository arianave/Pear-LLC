// Button.js
import React, { useEffect, useState } from 'react';
import './Button.css'; // Import CSS file for button styling

function Button() {
  //'data' empty array to store fetched data
  //'setData' updates data with new fetched info
  const [data, setData] = useState([]);
  const [collection, setCollection] = useState('');

  //listens for when the button is clicked
  const handleClick = async (collectionName) => {
    //sends request to the URL for the user data
    const response = await fetch('http://98.80.48.42:3000/api/' + collectionName);
    const json = await response.json();
    console.log(json)
    //updates the data variable with fetched JSON data
    setData(json)
    setCollection(collectionName)
  };

  //describes what the component renders on the screen
  return (
    <div>
      {/* Buttons to fetch different collections */}
      <div className="button-container">
        <button onClick={() => handleClick('users')}>Show Users</button>
        <button onClick={() => handleClick('posts')}>Show Posts</button>
        <button onClick={() => handleClick('comments')}>Show Comments</button>
      </div>

      {/* Display the fetched data */}
      <div className="data-container">
        {collection && <h1>{collection.charAt(0).toUpperCase() + collection.slice(1)} Collection</h1>} {/* Display the collection name */}

        {collection === 'users' && (
          <ul>
            {data.map(user => (
              <li key={user._id}>
                <p>Name: {user.name}</p>
                <p>Age: {user.age}</p>
                <p>Email: {user.email}</p>
              </li>
            ))}
          </ul>
        )}

        {collection === 'posts' && (
          <ul>
            {data.map(post => (
              <li key={post._id}>
                <p>Content: {post.content}</p>
                <p>Media: {post.media_url}</p>
                <p>Timestamp: {new Date(post.timestamp).toLocaleString()}</p>
                <p>Votes: {post.votes_count}</p>
                <p>Tags: {post.tags.join(', ')}</p>
                <p>Comments: {post.comments.length}</p>
              </li>
            ))}
          </ul>
        )}

        {collection === 'comments' && (
          <ul>
            {data.map(comment => (
              <li key={comment._id}>
                <p>Comment: {comment.content}</p>
                <p>Post ID: {comment.post_id}</p>
                <p>Timestamp: {new Date(comment.timestamp).toLocaleString()}</p>
                <p>Votes: {comment.votes_count}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Button;

