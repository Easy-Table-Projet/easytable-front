// services/authService.js
import apiClient from "./apiClient";
import { extractUserInfoFromToken, isValidToken } from "@/utils/tokenUtils";

/**
 * Authentication service for handling user authentication
 */
class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  async register(userData) {
    try {
      // API 요청에 role 대신 memberType을 사용하도록 수정
      const apiData = {
        email: userData.email,
        password: userData.password,
        memberType: userData.role, // role을 memberType으로 매핑
      };

      return await apiClient.post("/api/auth/signup", apiData);
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  /**
   * Log in a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} Login result with user and token
   */
  async login(credentials) {
    try {
      // 기존 apiClient.post 사용 (수정된 handleResponse가 헤더의 토큰도 가져옴)
      const response = await apiClient.post("/api/auth/signin", credentials);

      // 토큰 확인
      const token = response.token;

      if (!token) {
        throw new Error("Authentication failed: No token received");
      }

      // 사용자 정보 확인
      let user = response.user;

      // 응답에 사용자 정보가 없으면 토큰에서 추출
      if (!user || Object.keys(user || {}).length === 0) {
        user = extractUserInfoFromToken(token);

        // 그래도 없으면 이메일만 사용
        if (Object.keys(user).length === 0 && credentials.email) {
          user = { email: credentials.email };
        }
      }

      // 인증 정보 저장
      this.setToken(token);
      this.setUserInfo(user);

      return { user, token };
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  }

  /**
   * Validate the current token and get the latest user information
   * @returns {Promise<Object>} User information if token is valid
   */
  async validateToken() {
    try {
      if (!this.isAuthenticated()) {
        throw new Error("No authentication token found");
      }

      // Validate token with backend using the /api/auth/me endpoint
      const userData = await apiClient.get("/api/auth/me");

      return userData;
    } catch (error) {
      console.error("Token validation error:", error);
      // Clear auth data on validation failure
      this.clearAuthData();
      throw error;
    }
  }

  /**
   * Log out the current user
   */
  async logout() {
    try {
      const token = this.getToken();
      if (token) {
        await apiClient.post("/api/auth/logout", {}, {}, token).catch(() => {});
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      this.clearAuthData();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  }

  /**
   * Store authentication token
   * @param {string} token - JWT token
   */
  setToken(token) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token);
    }
  }

  /**
   * Get stored authentication token
   * @returns {string|null} JWT token
   */
  getToken() {
    return typeof window !== "undefined"
      ? localStorage.getItem("authToken")
      : null;
  }

  /**
   * Store user information
   * @param {Object} userInfo - User data
   */
  setUserInfo(userInfo) {
    if (typeof window !== "undefined") {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }

  /**
   * Get stored user information
   * @returns {Object|null} User data
   */
  getUserInfo() {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    }
    return null;
  }

  /**
   * Get the user's role
   * @returns {string|null} User role
   */
  getUserRole() {
    return this.getUserInfo()?.role || null;
  }

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated() {
    const token = this.getToken();
    return isValidToken(token);
  }

  /**
   * Store email for "Remember Me" feature
   * @param {string} email - User email
   */
  setRememberedEmail(email) {
    if (typeof window !== "undefined") {
      localStorage.setItem("userEmail", email);
    }
  }

  /**
   * Get stored email from "Remember Me" feature
   * @returns {string|null} User email
   */
  getRememberedEmail() {
    return typeof window !== "undefined"
      ? localStorage.getItem("userEmail")
      : null;
  }

  /**
   * Clear all authentication data
   */
  clearAuthData() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
    }
  }
}

// Export a singleton instance
const authService = new AuthService();
export default authService;
