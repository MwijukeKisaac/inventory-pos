import axios from "axios";

const api = axios.create({
  baseURL: "http://YOUR_PC_IP:5000/api", // change later
  timeout: 5000,
});

export default api;
