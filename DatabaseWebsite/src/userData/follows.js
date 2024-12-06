import { getUserId } from "./user";
import getServerURL from './serverURL';

export const getFollowers = async () => {
    const userId = getUserId();
    try {
        const response = await fetch(`${getServerURL()}/api/followers/${userId}`)
        const result = await response.json();

        if (result.success) {
            return result.followers;
        } else {
            throw new Error('Error retrieving followers');
        }
    } catch (error) {
        console.error('Error fetching followers:', error);
        return null;
    }
}

export const getFollowing = async () => {
    const userId = getUserId();
    try {
        const response = await fetch(`${getServerURL()}/api/following/${userId}`)
        const result = await response.json();

        if (result.success) {
            return result.followers;
        } else {
            throw new Error('Error retrieving following');
        }
    } catch (error) {
        console.error('Error fetching following:', error);
        return null;
    }
}