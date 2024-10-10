import { getUserId } from "./user";

export const getChats = async () => {
    const userId = getUserId();
    try {
      const response = await fetch(`http://98.80.48.42:3000/api/chats/${userId}`);
      const result = await response.json();

      if (result.success) {
        return result.chats; 
      } else {
        throw new Error('Error retrieving chats');
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      return null;
    }
  };