import axios from "axios";

const apiRequest = axios.create({
    baseURL: process.env.NEXT_BACKEND_API_URL,
    withCredentials: true,
});

export default apiRequest;