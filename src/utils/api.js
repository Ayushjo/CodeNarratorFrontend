import axios from "axios";

const API = axios.create({
  baseURL: "https://codenarrator.onrender.com/api/docs", // backend running on 5000
});

export default API;
