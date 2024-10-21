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
  const chatMessagesRef = useRef(null);

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
        // Filter out users that are already in uniqueChatUsers to avoid duplicates
        const filteredResults = result.users.filter(user => 
          !uniqueChatUsers.some(chatUser => chatUser.userId === user._id) &&
          !newChats.some(newChat => newChat.userId === user._id) // Also check against newChats
        );
  
        if (filteredResults.length > 0) {
          const newChatEntries = filteredResults.map(user => ({
            userId: user._id.toString(),
            username: user.username
          }));

          setNewChats(prevNewChats => [...prevNewChats, ...newChatEntries]); // Safely update newChats
          setUniqueChatUsers(prevUsers => [...prevUsers, ...newChatEntries]); // Ensure UI reflects changes immediately
        } else {
          console.log("All users in search results are already in chats.");
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
      console.log("Fetched chats:", chatsData);
  
      // Get unique user IDs from chats (both sender and receiver), excluding the current user
      const userIds = [...new Set(
        chatsData
          .flatMap(chat => [chat.sender, chat.receiver])
          .filter(id => id !== userID) // Exclude the current user
      )];
    
      // Fetch usernames for those user IDs
      const userObjects = await Promise.all(userIds.map(async (id) => {
        console.log("Fetching username for ID:", id);
        const username = await getUsername(id);
        if (username) {
          return { userId: id, username }; // Return both userId and username
        }
        return null;
      }));
  
      // Filter out any null values (in case some usernames don't exist)
    const fetchedUniqueUsers = userObjects.filter(user => user !== null);
    
    // Merge newly created chats with fetched chats, avoiding duplicates
    setUniqueChatUsers(prevUniqueChatUsers => {
      const existingUserIds = new Set(prevUniqueChatUsers.map(user => user.userId));
      const mergedUsers = [
        ...prevUniqueChatUsers,
        ...fetchedUniqueUsers.filter(user => !existingUserIds.has(user.userId)),
        ...newChats.filter(newChat => !existingUserIds.has(newChat.userId))
      ];
      console.log("Merged Users:", mergedUsers);
      return mergedUsers;
    });

    console.log("Updated uniqueChatUsers:", uniqueChatUsers);
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

        // Remove from newChats since it's now an actual chat with messages
        setNewChats(prevChats => prevChats.filter(chat => chat.userId !== selectedUser.userId));
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
      const filteredMessages = chats.filter(chat => 
        (chat.sender === userID && chat.receiver === selectedUser.userId) ||
        (chat.receiver === userID && chat.sender === selectedUser.userId)
      );
      setMessages(filteredMessages);
    }
  }, [selectedUser, chats, userID]);

  useEffect(() => {
    if (chatMessagesRef.current) {
      setTimeout(() => {
        chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
      }, 100); // Adjust the delay if necessary
    }
  }, [messages]);
  

  // Open chat with selected user
  const handleOpenChat = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
    console.log("unique chat users: ", uniqueChatUsers);
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
          uniqueChatUsers.map((user) => (
            <div key={user.userId} className="chat-item" onClick={() => handleOpenChat(user)}>
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
          <div className="chat-messages" ref={chatMessagesRef}>
            {messages.length === 0 ? (
              <p>No messages yet.</p>
            ) : (
              messages
              .slice()
              .sort((a, b) => new Date(a.messageDate) - new Date(b.messageDate))
              .map((message) => {
                const senderUsername = message.sender === userID ? 'You' : uniqueChatUsers.find(user => user.userId === message.sender)?.username || 'Unknown';
                
                return (
                  <div key={message._id || message.messageDate} className="message-item">
                    <p><strong>{senderUsername}:</strong> {message.messageContent}</p>
                    <small>{new Date(message.messageDate).toLocaleString()}</small>
                  </div>
                );
              })
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
