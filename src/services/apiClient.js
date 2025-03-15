// services/apiClient.js

// Get API URL from environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Base API client for making HTTP requests
 */
class ApiClient {
  /**
   * Create a request with the specified parameters
   * @param {string} url - The URL endpoint
   * @param {Object} options - Request options
   * @param {string} token - JWT token for authentication
   * @returns {Promise<Response>} Fetch response
   */
  async request(url, options = {}, token = null) {
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    // 토큰이 전달되지 않았다면 localStorage에서 authToken을 확인
    if (!token && typeof window !== "undefined") {
      token = localStorage.getItem("authToken");
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    // Prepend API_URL if the URL doesn't start with http
    const fullUrl = url.startsWith("http") ? url : `${API_URL}${url}`;

    try {
      return await fetch(fullUrl, {
        ...options,
        headers,
      });
    } catch (error) {
      console.error("Network error:", error);
      throw new Error("Network error: Unable to connect to the server");
    }
  }

  /**
   * Process response data with error handling
   * @param {Response} response - Fetch response
   * @returns {Promise<Object>} Parsed JSON response or empty object
   */
  async handleResponse(response) {
    const contentType = response.headers.get("Content-Type") || "";

    // 헤더에서 토큰 확인
    const authHeader = response.headers.get("Authorization");
    let token = null;

    if (authHeader) {
      // Bearer 접두사 제거
      token = authHeader.startsWith("Bearer ")
        ? authHeader.substring(7)
        : authHeader;
    }

    if (!response.ok) {
      let errorMessage = `Error ${response.status}: ${response.statusText}`;

      // Try to parse error message from response if it's JSON
      if (contentType.includes("application/json")) {
        try {
          const errorData = await response.json();
          if (errorData && typeof errorData === "object") {
            errorMessage = errorData.message || errorData.error || errorMessage;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
          // Continue with default error message if parsing fails
        }
      }

      throw new Error(errorMessage);
    }

    let result = {};

    // 응답 본문이 JSON인 경우 파싱
    if (contentType.includes("application/json")) {
      try {
        result = await response.json();
      } catch (e) {
        console.error("Error parsing JSON response:", e);
        // Return empty object if JSON parsing fails
      }
    } else if (contentType.includes("text/")) {
      // Handle text responses
      try {
        result = { text: await response.text() };
      } catch (e) {
        console.error("Error parsing text response:", e);
      }
    }

    // 헤더에서 가져온 토큰을 결과에 추가
    if (token) {
      result.token = token;
    }

    return result;
  }

  /**
   * Send a GET request
   */
  async get(url, options = {}, token = null) {
    try {
      const response = await this.request(
        url,
        { ...options, method: "GET" },
        token
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error(`GET request to ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Send a POST request
   */
  async post(url, data, options = {}, token = null) {
    try {
      const response = await this.request(
        url,
        {
          ...options,
          method: "POST",
          body: JSON.stringify(data),
        },
        token
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error(`POST request to ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Send a PUT request
   */
  async put(url, data, options = {}, token = null) {
    try {
      const response = await this.request(
        url,
        {
          ...options,
          method: "PUT",
          body: JSON.stringify(data),
        },
        token
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error(`PUT request to ${url} failed:`, error);
      throw error;
    }
  }

  /**
   * Send a DELETE request
   */
  async delete(url, options = {}, token = null) {
    try {
      const response = await this.request(
        url,
        { ...options, method: "DELETE" },
        token
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error(`DELETE request to ${url} failed:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
export default apiClient;
