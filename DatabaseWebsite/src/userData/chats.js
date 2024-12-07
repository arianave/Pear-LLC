import { getUserId } from "./user";
import getServerURL from '../pages/serverURL';

export const getChats = async () => {
    const userId = getUserId();
    try {
      const response = await fetch(`${getServerURL()}/api/chats/${userId}`);
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