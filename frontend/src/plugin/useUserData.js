import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

function useUserData() {
  try {
    // Retrieve the tokens
    const access_token = Cookies.get("access_token");
    const refresh_token = Cookies.get("refresh_token");

    if (!access_token || !refresh_token) {
      console.log("Tokens missing");
      return null;
    }

    // Try to decode the refresh token
    try {
      const decoded = jwtDecode(refresh_token);
      return decoded;
    } catch (error) {
      // Handle JWT decode errors specifically
      if (error.name === "InvalidTokenError") {
        console.error("Invalid token format:", error.message);
      } else {
        console.error("Token decode error:", error);
      }
      return null;
    }
  } catch (error) {
    console.error("useUserData error:", error);
    return null;
  }
}

export default useUserData;
