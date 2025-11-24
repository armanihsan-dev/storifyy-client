import axios from "axios";
import { BASE_URL } from "../utility/Server";

const axiosAPI = axios.create({
    baseURL: BASE_URL, // your backend base url
    withCredentials: true,
});

export default axiosAPI;
