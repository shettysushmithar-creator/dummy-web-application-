import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getMessages = async () => {
    try {
        const response = await axios.get(`${API_URL}/messages`);
        return response.data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        return [];
    }
};

export const sendMessage = async (messageData) => {
    try {
        const response = await axios.post(`${API_URL}/messages`, messageData);
        return response.data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};

export const clearMessages = async () => {
    try {
        await axios.delete(`${API_URL}/messages`);
        return true;
    } catch (error) {
        console.error('Error clearing messages:', error);
        return false;
    }
};

// Facebook Messenger reply
export const sendReply = async (platform, recipientId, text) => {
    try {
        const response = await axios.post(`${API_URL}/send-message`, { platform, recipientId, text });
        return response.data;
    } catch (error) {
        console.error('Error sending reply:', error);
        throw error;
    }
};
