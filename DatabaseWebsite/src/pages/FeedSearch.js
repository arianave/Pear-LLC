import React, { useState, useEffect, useRef } from 'react'; 
import '../CSS/FeedSearch.css';
import { getUsername } from '../userData/user';
import { getUserId } from '../userData/user';
import { Link } from 'react-router-dom';
import getServerURL from './serverURL';

function FeedSearch() {
  const [showSearch, setShowSearch] = useState(false); // State to show/hide search bar
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [searchResults, setSearchResults] = useState([]);
  const userID = getUserId();
  const [error, setError] = useState('');

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission prevented"); // Log to verify it's being called
    console.log(`Searching for ${searchTerm}`);
    if (searchTerm.trim() === '') return; // Prevent empty searches
    
    try {
      const response = await fetch(`${getServerURL()}/api/searchUsers/${searchTerm}`);
      const result = await response.json();
      console.log('API response:', result); // Log the API response

      if (result.success) {
        setSearchResults(result.users); // Store search results in state
        console.log('Search result:', result.users);

      } else {
        console.error('Error searching for users:', result.message);
      }
    } catch (error) {
      setError('Search request failed. Please try again.');
      console.error('Search request failed:', error);
    }
  };

  
  return (
    <div className="feed-search-page">
      <form onSubmit={handleSearchSubmit} className="feed-search-form">   
        <input
          type="text"
          placeholder="Search for accounts, threads, or keywords"
          value={searchTerm}
          onChange={handleSearchChange}
          className="feed-search-input"
        />
        
        <button type="submit">Search</button>
      </form>

      {/* Display search results or a message if no users found */}
      <div className="user-list">
        {searchResults.length === 0 ? (
          <p>No users found.</p>
        ) : (
          searchResults.map((user) => (
            /* Redirection to User profile after search */
            <div key={user._id} className="user-item">
              <Link to={`/ProfilePage/${user._id}`} className="username-link">
                <p>{user.username}</p>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default FeedSearch;