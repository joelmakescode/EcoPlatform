import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost/api';

const api = axios.create({
   baseURL: API_URL,
   headers: {
       'Content-Type': 'application/json'
   }
});

export async function request(method, url, data = null) {
    try {
        const res = await api({ method, url, data });
        return res.data;
    } catch(error) {
        console.error(`API ERROR!:`, error.response?.data || error.message);
    }
}