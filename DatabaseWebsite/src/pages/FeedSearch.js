import React, { useState } from 'react';
import '../CSS/FeedSearch.css'; //importing the css // Import CSS for styling

function FeedSearch() {
  const [searchTerm, setSearchTerm] = useState(''); // State for search input

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search functionality here
    console.log(`Searching for: ${searchTerm}`);
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
        <button type="submit" className="feed-search-button">Search</button>
      </form>
    </div>
  );
}

export default FeedSearch;
