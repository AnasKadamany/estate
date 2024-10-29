import axios from "axios";

const apiRequest = axios.create({
  baseURL: "https://api-service-372484292547.us-central1.run.app/api",
  withCredentials: true,
});

export default apiRequest;
