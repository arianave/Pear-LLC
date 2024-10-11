import React, { useState, useEffect, useRef } from 'react';
import './MessagePage.css'; 
import { getChats } from '../userData/chats';
import { getUsername } from '../userData/user';
import { getUserId } from '../userData/user';

function MessagePage({}) {
  const [chats, setChats] = useState([]); // State for storing existing chats
  const [showSearch, setShowSearch] = useState(false); // State to show/hide search bar
  const [searchTerm, setSearchTerm] = useState(''); // State for search input
  const [uniqueChatUsers, setUniqueChatUsers] = useState([]); // Users chatted with
  const [showPopup, setShowPopup] = useState(false); // State for popup window
  const [selectedUser, setSelectedUser] = useState(null); // The user currently chatting with
  const [messages, setMessages] = useState([]); // Messages with the selected user
  const [newMessage, setNewMessage] = useState([])
  const userID = getUserId();
  const intervalRef = useRef(null); // Ref to store interval ID for cleanup
  const [newChats, setNewChats] = useState([]); // To track manually created chats


  // Function to handle starting a chat (simple search for now)
  const handleStartChat = () => {
    setShowSearch(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = async () => {
    console.log(`Searching for ${searchTerm}`);
    if (searchTerm.trim() === '') return; // Prevent empty searches
    
    try {
      // Make a request to your backend API to search for users
      const response = await fetch(`http://98.80.48.42:3000/api/searchUsers/${searchTerm}`);
      const result = await response.json();
      
      if (result.success) {
        // Handle search results
        if (result.users.length > 0) {
          console.log("Search Results:", result.users);
          setUniqueChatUsers(result.users); // Update the list of chat users to show search results
        } else {
          console.log("No users found.");
        }
      } else {
        console.error('Error searching users:', result.message);
      }
    } catch (error) {
      console.error('Search request failed:', error);
    }
    
    setShowSearch(false); // Hide search after submission
  };

  // Fetch chats from backend or database
  const fetchChats = async () => {
    const chatsData = await getChats();
  
    if (chatsData) {
      setChats(chatsData); // Update state with the fetched chats
      console.log(chatsData)
  
      // Get unique user IDs from chats (both sender and receiver), excluding the current user
      const userIds = [...new Set(
        chatsData
          .flatMap(chat => [chat.sender, chat.receiver])
          .filter(id => id !== userID) // Exclude the current user
      )];
    
      // Fetch usernames for those user IDs
      const userObjects = await Promise.all(userIds.map(async (id) => {
        console.log(id)
        const username = await getUsername(id);
        if (username) {
          return { userId: id, username }; // Return both userId and username
        }
        return null;
      }));
  
      // Filter out any null values (in case some usernames don't exist)
      setUniqueChatUsers(userObjects.filter(user => user !== null)); 
      console.log("Unique Chat Users:", userObjects.filter(user => user !== null));
    }
    
  };

  const sendMessage = async () => {
    if (newMessage.trim() === '') return; // Prevent empty messages

    try {
      const response = await fetch(`http://98.80.48.42:3000/api/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: userID, // Use the sender prop
          receiverId: selectedUser.userId, // Use the receiver prop
          content: newMessage,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Append the new message from result.newMessage
        setMessages((prevMessages) => [...prevMessages, result.newMessage]);
        setNewMessage(''); // Clear input field
      } else {
        console.error('Failed to send message:', result.message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    // Initial fetch on component mount
    const fetchData = async () => {
      await fetchChats(); // Fetch initial chats
    };

    fetchData(); // Call the internal async function

    // Set up polling to refetch chats every 5 seconds (5000ms)
    intervalRef.current = setInterval(() => {
      fetchChats(); // Fetch chats periodically
    }, 5000); // Update every 5 seconds

    // Cleanup: Clear interval when component unmounts
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []); // Empty dependency array means it runs on mount/unmount

  // Trigger fetchMessages when selectedUser changes
  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.userId);
    }
  }, [selectedUser]);

  // Open chat with selected user
  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
    console.log("unique chat users: ", uniqueChatUsers);

    // Fetch the message history with this user from existing chats
    fetchMessages(user.userId);
  };

  // Filter messages between current user and selected user
  const fetchMessages = (userId) => {
    console.log("UserID: ", userId);
    
    // Filter messages between the current user and the selected user
    if (selectedUser) { // Check if selectedUser is not null
      const filteredMessages = chats.filter(chat => 
        (chat.sender === userId || chat.receiver === userId) &&
        (chat.sender === selectedUser.userId || chat.receiver === selectedUser.userId)
      );
    
    console.log(filteredMessages);
    setMessages(filteredMessages); // Update state with filtered messages
    } else {
       console.log("No user selected, cannot fetch messages.");
    }
  };
  // Close the chat popup
  const handleCloseChat = () => {
    setShowPopup(false);
    setSelectedUser(null);
    setMessages([]);
  };

  return (
    <div className="messages-page">
      <div className="messages-header">
        <button className="plus-button" onClick={handleStartChat}>+</button>
      </div>

      {showSearch && (
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Enter username" 
            value={searchTerm} 
            onChange={handleSearchChange}
          />
          <button onClick={handleSearchSubmit}>Search</button>
        </div>
      )}

      <div className="message-list">
      {uniqueChatUsers.length === 0 ? (
          <p>No messages found, try starting a chat!</p>
        ) : (
          uniqueChatUsers.map((user, index) => (
            <div key={index} className="chat-item" onClick={() => handleOpenChat(user)}>
              <p>{user.username}</p> {/* Display username instead of userId */}
            </div>
          ))
        )}
      </div>
       {/* Popup for showing messages */}
       {showPopup && (
        <div className="chat-popup">
          <div className="chat-header">
            <h2>Chat with {selectedUser.username}</h2>
            <button onClick={handleCloseChat}>Close</button>
          </div>
          <div className="chat-messages">
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages
              .slice() // Create a copy of the array to avoid mutating the original state
              .sort((a, b) => new Date(a.messageDate) - new Date(b.messageDate)) // Sort by date in ascending order
              .map((message, index) => (
                <div key={index} className="message-item">
                  <p>{message.messageContent}</p>
                  <small>{new Date(message.messageDate).toLocaleString()}</small>
                </div>
              ))
            )}
          </div>
          <div className="chat-input">
             <input 
              type="text" 
              placeholder="Type a message..." 
              value={newMessage} 
              onChange={(e) => setNewMessage(e.target.value)} // Update newMessage state
            />
            <button onClick={sendMessage}>Send</button> {/* Call sendMessage on click */}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessagePage;
