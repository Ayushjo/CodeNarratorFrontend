import axios from "axios";

const API = axios.create({
  baseURL: "https://codenarrator.onrender.com/api/docs",
  timeout: 180000, // 3 minutes
});

export default API;
