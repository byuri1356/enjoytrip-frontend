import axios from 'axios';

function apiInstance() {
    const instance = axios.create({
        baseURL: process.env.VUE_APP_API_BASE_URL,
        headers: {
            "Content-Type": "application/json;charset-uft-8",
            "Access-Control-Allow-Origin": '*',
        }
    });
    return instance;
}

export { apiInstance };