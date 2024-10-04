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