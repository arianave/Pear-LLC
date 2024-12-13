import getServerURL from '../pages/serverURL';
import { getUserId } from './user';

// Retrives all communities made by the user
export const getUserCommunities = async (userId) => {
  const userID = userId; // Retrieve the current user's ID
  try {
    const response = await fetch(`${getServerURL()}/api/threads`); // Fetch all threads from the backend
    const allThreads = await response.json();

    // Filter the threads by user ID
    const userThreads = allThreads.filter(thread => thread.userID === userID);
    
    return userThreads; // Return or store the filtered threads
  } catch (error) {
    console.error('Error fetching user threads:', error);
    return [];
  }
};

export const getUserJoinedCommunities = async (userId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/threads`); // Fetch all threads from the backend
    const allThreads = await response.json();

    // Filter threads where the user's ID is in the 'joins' array
    const joinedThreads = allThreads.filter(thread => thread.joins?.includes(userId));
    
    return joinedThreads; // Return or store the filtered threads
  } catch (error) {
    console.error('Error fetching joined threads:', error);
    return [];
  }
};

export const getUserCommunity = async (communityId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/community/${communityId}`);
    const community = await response.json();

    return community;
  } catch (error) {
    console.error('Error fetching community:', error);
    return null;
  }
};

export const getCommunityThreads = async (threadIds) => {
  try {
    // Fetch all posts from the API
    const response = await fetch(`${getServerURL()}/api/posts`, {
      method: 'GET', // Assuming this endpoint uses GET
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }

    // Parse the response into a JSON array
    const allPosts = await response.json();

    // Filter the posts to include only those with matching IDs
    const filteredPosts = allPosts.filter((post) => threadIds.includes(post._id));

    return filteredPosts; // Return the filtered array of posts
  } catch (error) {
    console.error('Error fetching community threads:', error);
    return [];
  }
};

export const addThread = async (communityId, threadContent) => {
  const userId = getUserId();
  const postType = "thread";
  try {
    const response = await fetch(`${getServerURL()}/api/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ communityId, threadContent, userId, postType }),
  });

  const result = await response.json();
  if (result.success) {
    return true;
  }
  } catch (error) {
    console.error('Error, unable to add thread: ', error);
    return false;
  }
};

export const joinCommunity = async (communityId, userId) => {
  try {
    const response = await fetch(`${getServerURL()}/api/community/join`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ communityId, userId }),
  });
  const result = await response.json();
  if (result.success) {
    return true;
  }
  } catch (error) {
    console.error('Error while joining community', error);
    return false;
  }
};
