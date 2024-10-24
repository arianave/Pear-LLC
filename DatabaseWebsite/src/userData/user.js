// Function to store user ID in localStorage
export function storeUserId(userId) {
    localStorage.setItem('userId', userId);
  }
  
  // Function to retrieve user ID from localStorage
  export function getUserId() {
    return localStorage.getItem('userId');
  }
  
  // Function to remove user ID (e.g., on logout)
  export function removeUserId() {
    localStorage.removeItem('userId');
  }
  
  // Function to get all user information from the database
  export const getUserInfo = async () => {
    const userId = getUserId();
    try {
      const response = await fetch(`http://98.80.48.42:3000/api/users/${userId}`);
      const result = await response.json();

      if (result.success) {
        return result.user; // Returns the full user object with all fields
      } else {
        throw new Error('Error retrieving user information');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
      return null;
    }
  };

  export const getUsername = async (userID) => {
    const userId = userID;
    if(userID){
    try {
      const response = await fetch(`http://98.80.48.42:3000/api/username/${userId}`);
      const result = await response.json();
  
      if (result.success) {
        return result.user.username; // Returns just the username string
      } else {
        throw new Error('Error retrieving username');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      return null;
    }
  }
  };

 // Function to fetch followers of the current user
export const getUserFollowers = async () => {
  const userId = getUserId(); // Get the current user's ID
  console.log(`Fetching followers for user ID: ${userId}`);

  try {
    const url = `http://98.80.48.42:3000/api/followers/${userId}`;
    console.log(`Requesting followers from URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Received response with status: ${response.status}`);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (!result.success) {
      console.log('Followers successfully retrieved:', result.followers);
      return result; // Return the list of followers
    } else {
      console.error('Error: Followers retrieval failed with message:', result.message);
      throw new Error(`Error retrieving followers: ${result.message}`);
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

// Function to fetch users the current user is following
export const getUserFollowing = async () => {
  const userId = getUserId(); // Get the current user's ID
  console.log(`Fetching following for user ID: ${userId}`);

  try {
    const url = `http://98.80.48.42:3000/api/following/${userId}`;
    console.log(`Requesting following from URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Received response with status: ${response.status}`);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (!result.success) {
      console.log('Following list successfully retrieved:', result.following);
      return result; // Return the list of users the current user is following
    } else {
      console.error('Error: Following retrieval failed with message:', result.message);
      throw new Error(`Error retrieving following: ${result.message}`);
    }
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
  }
};

// Function to follow a specific user
export const followUser = async (followUserId) => {
  const userId = getUserId(); // Get the current user's ID

  try {
    const response = await fetch('http://98.80.48.42:3000/api/follow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, followUserId }), // Send both userId and followUserId
    });

    const result = await response.json();

    if (result.success) {
      return true; // Follow successful
    } else {
      throw new Error('Error following user');
    }
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};

// Function to unfollow a specific user
export const unfollowUser = async (unfollowUserId) => {
  const userId = getUserId(); // Get the current user's ID
  try {
    const response = await fetch('http://98.80.48.42:3000/api/unfollow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, unfollowUserId }), // Send both userId and unfollowUserId
    });

    const result = await response.json();

    if (result.success) {
      return true; // Unfollow successful
    } else {
      throw new Error('Error unfollowing user');
    }
  } catch (error) {
    console.error('Error unfollowing user:', error);
    return false;
  }
};

// Function to remove a specific user from following
export const removeUserFromFollowing = async (removeUserId) => {
  const userId = getUserId(); // Get the current user's ID
  try {
    const response = await fetch('http://98.80.48.42:3000/api/removeFollower', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, removeUserId }), // Send both userId and removeUserId
    });

    const result = await response.json();

    if (result.success) {
      return true; // Removal from followers successful
    } else {
      throw new Error('Error removing user from followers');
    }
  } catch (error) {
    console.error('Error removing user from followers:', error);
    return false;
  }
};
