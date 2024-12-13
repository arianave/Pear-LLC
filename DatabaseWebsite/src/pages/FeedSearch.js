import React, { useState, useEffect } from 'react';
import { getUsername } from '../userData/user';
import { Link } from 'react-router-dom';
import '../CSS/FeedSearch.css'; // Add your own styles
import getServerURL from './serverURL';

function FeedSearch() {
  const [searchTerm, setSearchTerm] = useState(''); // For storing the input in search bar
  const [searchResults, setSearchResults] = useState([]); // Store the search results
  const [uniqueChatUsers, setUniqueChatUsers] = useState([]); // Store users already in chats
  const [loading, setLoading] = useState(false); // Loading state while fetching data

  // Fetch unique chat users on initial load
  useEffect(() => {
    const fetchUniqueChatUsers = async () => {
      try {
        setLoading(true);

        // Fetching users already in chats
        const response = await fetch(`${getServerURL()}/api/chats`);
        const data = await response.json();
        
        if (data.success) {
          setUniqueChatUsers(data.users);
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUniqueChatUsers();
  }, []);

  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle search submit
  const handleSearchSubmit = async () => {
    if (searchTerm.trim() === '') return; // Prevent empty search

    try {
      setLoading(true);

      const response = await fetch(`${getServerURL()}/api/searchUsers/${searchTerm}`);
      const data = await response.json();

      if (data.success) {
        // Filter out users already in chats
        const filteredResults = data.users

        setSearchResults(filteredResults);
      } else {
        console.error('Error searching users:', data.message);
      }
    } catch (error) {
      console.error('Search request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page">
      <h1>Search Users</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchSubmit}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

      {searchResults.length === 0 && !loading && (
        <p>No users found. Try a different search.</p>
      )}

      <div className="search-results">
        {searchResults.map((user) => (
          <div key={user._id} className="search-result-item">
            <p>{user.username}</p>
            <Link to={`/ProfilePage/${user._id}`} className="username-link-search">
              {user.username}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedSearch;