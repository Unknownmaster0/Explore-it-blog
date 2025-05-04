import axios from "axios";

const apiInstance = axios.create({
  baseURL: "https://explore-it.onrender.com/api/v1/" || "http://127.0.0.1:8000/api/v1/",

  timeout: 50000, // timeout after 5 seconds

  headers: {
    "Content-Type": "application/json", // The request will be sending data in JSON format.
    Accept: "application/json", // The request expects a response in JSON format.
  },
});
export default apiInstance;
