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
  