import getServerURL from '../pages/serverURL';

// Function to fetch posts created by the user
async function getUserPosts(userId) {
  const userID = userId; // Retrieve the current user's ID
  try {
    const response = await fetch(`${getServerURL()}/api/posts`); // Fetch all posts from the backend
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
