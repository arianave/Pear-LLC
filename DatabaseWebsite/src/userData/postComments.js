// Function to fetch comments based on the post ID
export const getPostComments = async (postId) => {
    try {
      const response = await fetch(`http://98.80.48.42:3000/api/comments/${postId}`);
      const result = await response.json();
  
      if (result.success) {
        return result.comments; // Returns the array of comments
      } else {
        throw new Error('Error retrieving comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return []; // Return an empty array in case of error
    }
  };
  