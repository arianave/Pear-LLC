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

  // Handle dropdown selection
  const handleSelectChange = (event) => {
    const selectedCollection = event.target.value;
    if (selectedCollection) {
      handleClick(selectedCollection);
    }
  };

  //describes what the component renders on the screen
  return (
    <div>
      {/* Dropdown to select different collections */}
      <div className="dropdown-container">
        <select onChange={handleSelectChange}>
        <option value="">Select Collection</option> {/* Default option */}
          <option value="users">Users</option>
          <option value="posts">Posts</option>
          <option value="comments">Comments</option>
          <option value="threads">Threads</option>
          <option value="votes">Votes</option>
          <option value="tags">Tags</option>
          <option value="messages">Messages</option>
          <option value="follows">Follows</option>
          <option value="joins">Joins</option>
        </select>
      </div>

      {/* Display the fetched data */}
      <div className="scrollable-panel">
        {collection && <h1>{collection.charAt(0).toUpperCase() + collection.slice(1)} Collection</h1>} {/* Display the collection name */}

        {collection === 'users' && (
          <ul>
            {data.map(user => (
              <li key={user._id}>
                <p>User ID: {user.userID}</p>
                <p>Username: {user.username}</p>
                <p>Email: {user.email}</p>
                <p>First Name: {user.firstName}</p>
                <p>Last Name: {user.lastName}</p>
                <p>Birthdate: {new Date(user.birthDate).toLocaleDateString()}</p>
                <p>Account Created: {new Date(user.creationDate).toLocaleString()}</p>
                <p>Biography: {user.profileBiography}</p>
                <p>Privacy: {user.accountPrivacy}</p>
              </li>
            ))}
          </ul>
        )}

        {collection === 'posts' && (
          <ul>
            {data.map(post => (
              <li key={post._id}>
                <p>Post ID: {post.postID}</p>
                <p>User ID: {post.userID}</p>
                <p>Text Content: {post.textContent}</p>
                <p>Media Content: {post.mediaContent}</p>
                <p>Posted On: {new Date(post.creationDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

        {collection === 'comments' && (
          <ul>
            {data.map(comment => (
              <li key={comment._id}>
                <p>Comment ID: {comment.commentID}</p>
                <p>Post ID: {comment.postID}</p>
                <p>User ID: {comment.userID}</p>
                <p>Comment: {comment.textContent}</p>
                <p>Commented On: {new Date(comment.creationDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Threads Collection */}
        {collection === 'threads' && (
          <ul>
            {data.map(thread => (
              <li key={thread.threadID}>
                <p>Thread ID: {thread.threadID}</p>
                <p>Thread Name: {thread.threadName}</p>
                <p>User ID: {thread.userID}</p>
                <p>Created On: {new Date(thread.creationDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Votes Collection */}
        {collection === 'votes' && (
          <ul>
            {data.map(vote => (
              <li key={vote.voteID}>
                <p>Vote ID: {vote.voteID}</p>
                <p>Post ID: {vote.postID}</p>
                <p>Upvotes: {vote.upvoteCount}</p>
                <p>Downvotes: {vote.downvoteCount}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Tags Collection */}
        {collection === 'tags' && (
          <ul>
            {data.map(tag => (
              <li key={tag.tagID}>
                <p>Tag ID: {tag.tagID}</p>
                <p>Post ID: {tag.postID}</p>
                <p>Tag: {tag.tagName}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Messages Collection */}
        {collection === 'messages' && (
          <ul>
            {data.map(message => (
              <li key={message.messageID}>
                <p>Message ID: {message.messageID}</p>
                <p>User ID: {message.userID}</p>
                <p>Message: {message.messageContent}</p>
                <p>Date: {new Date(message.messageDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Follows Collection */}
        {collection === 'follows' && (
          <ul>
            {data.map(follow => (
              <li key={follow._id}>
                <p>User ID: {follow.userID}</p>
                <p>Request Status: {follow.requestStatus}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Joins Collection */}
        {collection === 'joins' && (
          <ul>
            {data.map(join => (
              <li key={join._id}>
                <p>User ID: {join.userID}</p>
                <p>Thread ID: {join.threadID}</p>
                <p>Join Status: {join.joinStatus ? "Joined" : "Not Joined"}</p>
                <p>Joined: {new Date(join.joinDate).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}

export default Button;
