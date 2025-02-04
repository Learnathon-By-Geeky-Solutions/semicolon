import axios from 'axios';
import { SERVER_URL } from '../constants/paths';

const API_URL = `${SERVER_URL}/api/v1/auth`;

interface User {
    name: string;
    email: string;
    verificationCode: string;
}

export const verifyEmail = async (user: User): Promise<boolean> => {
    const url = `${API_URL}/verify-email`;
    try {
        const response = await axios.post(url, user);
        console.log("Email verified successfully", response);
        return true;
    } catch (error) {
        console.error("Error verifying email", error);
        return false;
    }

}

