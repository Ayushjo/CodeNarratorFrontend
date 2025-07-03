import axios from "axios";

const API = axios.create({
  baseURL: "https://codenarrator-production.up.railway.app/api/docs",
  timeout: 180000,
});

export default API;
