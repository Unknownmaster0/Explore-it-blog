import axios from "axios";
import {
  getRefreshToken,
  isAccessTokenExpired,
  logout,
  setAuthUser,
} from "./auth";
import { API_BASE_URL } from "./constants";
import Cookies from "js-cookie";

// Define a custom Axios instance creator function
const useAxios = () => {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");

  // Create an Axios instance with base URL and access token in the headers
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  axiosInstance.interceptors.request.use(async (req) => {
    // Check if the access token is expired
    if (!isAccessTokenExpired(accessToken)) {
      logout();
      return Promise.reject("Authentication required"); // If not expired, return the original request
    }

    // If the access token is expired, refresh it
    if (!accessToken || isAccessTokenExpired(accessToken)) {
      try {
        const response = await getRefreshToken(refreshToken);
        setAuthUser(response.access, refreshToken);
        req.headers.Authorization = `Bearer ${response?.data?.access}`;
      } catch (error) {
        logout();
        return Promise.reject("Session expired");
      }
    }

    return req; // return the updated request
  });

  return axiosInstance; // Return the custom Axios instance
};

export default useAxios; // Export the custom Axios instance creator function
