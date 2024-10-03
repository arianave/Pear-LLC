import { getUserId } from './user'; // Import the function to get user ID

// Function to fetch posts created by the user
async function getUserPosts() {
  const userID = getUserId(); // Retrieve the current user's ID
  try {
    const response = await fetch('http://98.80.48.42:3000/api/posts'); // Fetch all posts from the backend
    const allPosts = await response.json();

    // Filter the posts by user ID
    const userPosts = allPosts.filter(post => post.userID === userID);
    
    return userPosts; // Return or store the filtered posts
  } catch (error) {
    console.error('Error fetching user posts:', error);
    return [];
  }
}

export { getUserPosts };
