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
  try {
    const response = await fetch(`http://98.80.48.42:3000/api/followers/${userId}`);
    const result = await response.json();

    if (result.success) {
      return result.followers; // Return the list of followers
    } else {
      throw new Error('Error retrieving followers');
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
    return [];
  }
};

// Function to fetch users the current user is following
export const getUserFollowing = async () => {
  const userId = getUserId(); // Get the current user's ID
  try {
    const response = await fetch(`http://98.80.48.42:3000/api/following/${userId}`);
    const result = await response.json();

    if (result.success) {
      return result.following; // Return the list of users the current user is following
    } else {
      throw new Error('Error retrieving following');
    }
  } catch (error) {
    console.error('Error fetching following:', error);
    return [];
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
