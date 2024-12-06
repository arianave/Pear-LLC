import getServerURL from '../pages/serverURL';

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
  export const getUserInfo = async (userID) => {
    const userId = userID;
    try {
      const response = await fetch(`${getServerURL()}/api/users/${userId}`);
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

  export const getName = async (userID) => {
    const userId = userID;
    if(userID){
      try{
        const response = await fetch(`${getServerURL()}/api/name/${userId}`);
        const result = await response.json();

        if (result.success){
          return result.user.name;
        } else {
          throw new Error ('Error retieving name');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    }
  };

  export const getUsername = async (userID) => {
    const userId = userID;
    if(userID){
      try {
        const response = await fetch(`${getServerURL()}/api/username/${userId}`);
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

  export const setProfileInfo = async (bio, picture, isPrivate) => { 
    const userId = getUserId();
  
    try {
      const response = await fetch(`${getServerURL()}/api/users/${userId}/profile`, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          biography: bio,
          profilePicture: picture,
          isPrivate: isPrivate,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile information.');
      }
  
      const result = await response.json();
      console.log('Profile updated successfully:', result);
      return result; // Return the result for further use if needed
    } catch (error) {
      console.error('Error updating profile:', error.message);
      throw error; // Rethrow the error to handle it in the calling code
    }
  };

 // Function to fetch followers of the current user
export const getUserFollowers = async (userID) => {
  const userId = userID; // Get the current user's ID
  console.log(`Fetching followers for user ID: ${userId}`);

  try {
    const url = `${getServerURL()}/api/followers/${userId}`;
    console.log(`Requesting followers from URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Received response with status: ${response.status}`);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (response.ok && result.success) {
      // Followers successfully retrieved (including empty lists)
      console.log('Followers successfully retrieved:', result.followers);
      return result.followers; // Return the list of followers
    } else {
      // Handle unsuccessful retrieval or no followers found
      console.log('Error: Followers retrieval failed with message:', result.message);
      return []; // Return empty array for no followers or error case
    }
  } catch (error) {
    // General error handling
    console.error('Error fetching followers:', error);
    return []; // Return empty array on network failure or unexpected error
  }
};

// Function to fetch users the current user is following
export const getUserFollowing = async (userID) => {
  const userId = userID; // Get the current user's ID
  console.log(`Fetching following for user ID: ${userId}`);

  try {
    const url = `${getServerURL()}/api/following/${userId}`;
    console.log(`Requesting following from URL: ${url}`);
    
    const response = await fetch(url);
    console.log(`Received response with status: ${response.status}`);
    
    const result = await response.json();
    console.log('Response body:', result);

    if (response.ok && result.success) {
      // Successfully retrieved following list
      console.log('Following list successfully retrieved:', result.following);
      return result.following; // Return the list of users the current user is following
    } else {
      // Handle unsuccessful retrieval or no following found
      console.log('Error: Following retrieval failed with message:', result.message);
      return []; // Return an empty array for no data or errors
    }
  } catch (error) {
    // General error handling
    console.error('Error fetching following:', error);
    return []; // Return an empty array for network failure or unexpected error
  }
};

// Function to follow a specific user
export const followUser = async (followUserId) => {
  const userId = getUserId(); // Get the current user's ID

  try {
    const response = await fetch(`${getServerURL()}/api/follow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, followUserId }), // Send both userId and followUserId
    });

    const result = await response.json();

    if (result.success) {
      // After successful follow, add the user to the followUserId's followers list
      const addFollowerResponse = await fetch(`${getServerURL()}/api/addFollower`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ followUserId, userId }), // Swap IDs to add user to followers list
      });

      const addFollowerResult = await addFollowerResponse.json();

      if (addFollowerResult.success) {
        return true; // Both follow and add follower successful
      } else {
        console.error('Error adding to followers:', addFollowerResult.message);
        throw new Error('Error adding to followers');
      }
    } else {
      throw new Error('Error following user');
    }
  } catch (error) {
    console.error('Error following user:', error);
    return false;
  }
};

// Function to unfollow a specific user
export const unfollowUser = async (unfollowUserId, isSecondaryCall = false, userId = getUserId()) => {
  try {
    const response = await fetch(`${getServerURL()}/api/unfollow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, unfollowUserId }), // Send both userId and unfollowUserId
    });

    const result = await response.json();
    console.log('success: ', result.success)
    if (result.success) {
      if (!isSecondaryCall) {
        await removeUserFromFollowing(userId, true, unfollowUserId); // Set `isSecondaryCall` to true
      }
      return true; // Unfollow successful
    } else {
      throw new Error('Error unfollowing user');
    }
  } catch (error) {
    console.error('Error during unfollow operation:', error);
    return false;
  }
};

// Function to remove a specific user from following
export const removeUserFromFollowing = async (removeUserId, isSecondaryCall = false, userId = getUserId()) => {
  try {
    const response = await fetch(`${getServerURL()}/api/removeFollower`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, removeUserId }), // Send both userId and removeUserId
    });

    const result = await response.json();

    if (result.success) {
      // Call `unfollowUser` only if this is the primary call
      if (!isSecondaryCall) {
        await unfollowUser(userId, true, removeUserId); // Set `isSecondaryCall` to true
      }
      return true; // Removal from followers successful
    } else {
      throw new Error('Error removing user from followers');
    }
  } catch (error) {
    console.error('Error removing user from followers:', error);
    return false;
  }
};
