import getServerURL from '../pages/serverURL';

// Function to fetch comments based on the post ID
export const getPostComments = async (postId) => {
    try {
      const response = await fetch(`${getServerURL()}/api/comments/${postId}`);
      const result = await response.json();
  
      if (result.success) {
        return result.comments; // Returns the array of comments
      } else if (!result.success){
        console.log("No comments were found for this post")
        return [];
      } else {
        throw new Error('Error retrieving comments');
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
      return []; // Return an empty array in case of error
    }
  };
  
// Function to add a new comment to a post
export const addComment = async (userId, postId, content) => {
  try {
    const response = await fetch(`${getServerURL()}/api/addcomments/${postId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content, userId }),
    });
    const result = await response.json();

    if (result.success) {
      return result.comment; // Returns the newly added comment
    } else {
      throw new Error('Error adding comment');
    }
  } catch (error) {
    console.error('Error adding comment:', error);
    return null; // Return null in case of error
  }
};

// Function to upvote a post
export const upvotePost = async (postId, userId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/posts/${postId}/upvote/${userId}`, {
      method: 'POST',
    });
    const result = await response.json();

    if (result.success) {
      const overallVotesCount = result.upvoteCount - result.downvoteCount; // Calculate overall votes
      return overallVotesCount; // Returns the updated vote count
    } else {
      throw new Error('Error upvoting post');
    }
  } catch (error) {
    console.error('Error upvoting post:', error);
    return null; // Return null in case of error
  }
};

// Function to downvote a post
export const downvotePost = async (postId, userId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/posts/${postId}/downvote/${userId}`, {
      method: 'POST',
    });
    const result = await response.json();

    if (result.success) {
      const overallVotesCount = result.upvoteCount - result.downvoteCount; // Calculate overall votes
      return overallVotesCount; // Returns the updated vote count
    } else {
      throw new Error('Error downvoting post');
    }
  } catch (error) {
    console.error('Error downvoting post:', error);
    return null; // Return null in case of error
  }
};

// Function to check if a user has already voted on a post
export const checkIfUserHasVoted = async (postId, userId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/posts/${postId}/hasVoted?userId=${userId}`, {
      method: 'GET',
    });
    const result = await response.json();

    if (result.success) {
      return { hasVoted: result.hasVoted, voteType: result.voteType }; // Returns vote status and type
    } else if (!result.success){
      return { hasVoted: false, voteType: null };
    } else {
      throw new Error('Error checking vote status');
    }
  } catch (error) {
    console.error('Error checking if user has voted:', error);
    return { hasVoted: false, voteType: null }; // Default to no vote in case of error
  }
};

// Frontend: Function to get the vote count for a post
export const getPostVoteCount = async (postId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/posts/${postId}/voteCount`);
    const result = await response.json();

    if (result.success) {
      const { upvoteCount, downvoteCount } = result;
      const totalVoteCount = upvoteCount - downvoteCount; // Calculate the net vote count
      return totalVoteCount;
    } else {
      console.log("No votes found for this post")
      return 0;
    }
  } catch (error) {
    console.error('Error fetching vote count:', error);
    return null; // Return null in case of error
  }
};