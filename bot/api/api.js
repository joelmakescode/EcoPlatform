import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL;
const API_TOKEN = process.env.API_TOKEN;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`
    }
});

export async function request(method, url, data = null) {
    try {
        const config = { method, url };

        if (data !== null) {
            config.data = data;
        }

        const res = await api(config);
        return res.data;
    } catch (error) {
        console.error("API ERROR!:", error.response?.data || error.message);
    }
}