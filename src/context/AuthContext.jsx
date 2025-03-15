"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import authService from "@/services/authService";
import { useRouter, usePathname } from "next/navigation";

// Create Auth Context
const AuthContext = createContext(null);

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/", "/auth/login", "/auth/signup"];

/**
 * Authentication Provider Component
 * Provides authentication state and methods to the application
 */
export function AuthProvider({ children }) {
  // 여러 로딩 상태를 분리
  const [initialLoading, setInitialLoading] = useState(true); // 초기 인증 확인 로딩
  const [loginLoading, setLoginLoading] = useState(false); // 로그인 작업 로딩
  const [registerLoading, setRegisterLoading] = useState(false); // 회원가입 작업 로딩
  const [logoutLoading, setLogoutLoading] = useState(false); // 로그아웃 작업 로딩

  const [user, setUser] = useState(null);
  const [tokenExpiration, setTokenExpiration] = useState(null);
  const [tokenRemainingTime, setTokenRemainingTime] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  // Calculate token remaining time
  const calculateRemainingTime = useCallback(() => {
    if (user?.exp) {
      const currentTime = Math.floor(Date.now() / 1000); // 현재 시간(초)
      const remainingTime = user.exp - currentTime;
      setTokenRemainingTime(remainingTime > 0 ? remainingTime : 0);
      setTokenExpiration(user.exp);
      return remainingTime;
    }
    return null;
  }, [user]);

  // Format seconds to human readable time
  const formatRemainingTime = useCallback((seconds) => {
    if (!seconds || seconds <= 0) return "만료됨";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  }, []);

  // Check if current path is a public route
  const isPublicRoute = useCallback(() => {
    return (
      PUBLIC_ROUTES.includes(pathname) ||
      PUBLIC_ROUTES.some((route) => pathname.startsWith(route + "/"))
    );
  }, [pathname]);

  // Check authentication status and load user info
  const validateAuth = async () => {
    try {
      if (authService.isAuthenticated()) {
        // Validate token with backend through authService
        const freshUserData = await authService.validateToken();
        const userInfo = authService.getUserInfo();
        setUser(userInfo);
        calculateRemainingTime();
        return freshUserData;
      } else {
        setUser(null);
        setTokenExpiration(null);
        setTokenRemainingTime(null);
        return null;
      }
    } catch (error) {
      console.error("Auth validation error:", error);
      // No need to clear auth data here as validateToken already does it on failure
      setUser(null);
      setTokenExpiration(null);
      setTokenRemainingTime(null);
      return null;
    }
  };

  // Handle routing based on auth state
  const handleRouting = useCallback(() => {
    // Skip routing logic if still loading
    if (initialLoading || logoutLoading) return;

    // User is not authenticated and trying to access a protected route
    if (!user && !isPublicRoute()) {
      // Store the current path for redirecting back after login
      if (typeof window !== "undefined") {
        sessionStorage.setItem("redirectAfterLogin", pathname);
      }

      // Redirect to login page
      router.push("/auth/login");
    }
  }, [initialLoading, user, isPublicRoute, pathname, router]);

  // Initialize auth state on component mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        await validateAuth();
      } finally {
        setInitialLoading(false);
      }
    };

    initAuth();
  }, []);

  // Run routing logic whenever auth state, loading state, or pathname changes
  useEffect(() => {
    handleRouting();
  }, [user, initialLoading, pathname, handleRouting]);

  // Set up token expiration check - 1초마다 업데이트
  useEffect(() => {
    if (!user) return;

    // Initial calculation
    const remainingTime = calculateRemainingTime();

    // Set up interval to update remaining time every second
    const intervalId = setInterval(() => {
      const remaining = calculateRemainingTime();

      // If token is expired or about to expire (less than 1 minute),
      // trigger a token refresh or logout
      if (remaining !== null && remaining <= 60) {
        console.warn("Token is about to expire");
        // Optional: Add auto-refresh logic here
        // validateAuth();
      }

      // If token is expired, you might want to take action
      if (remaining !== null && remaining <= 0) {
        console.error("Token has expired");
        // Optional: Force logout or show a modal
        // logout();
      }
    }, 1000); // 1초마다 체크

    return () => clearInterval(intervalId);
  }, [user, calculateRemainingTime]);

  // Add focus event listener to validate token when browser tab gets focus
  useEffect(() => {
    const handleFocus = () => {
      // Only validate if we have a user (we're logged in)
      if (user) {
        validateAuth();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, [user]);

  /**
   * Login handler
   * @param {Object} credentials - User login credentials
   * @param {boolean} remember - Whether to remember the user
   * @returns {Promise<Object>} Login result
   */
  const login = async (credentials, remember) => {
    setLoginLoading(true);
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
      calculateRemainingTime();

      if (remember) {
        authService.setRememberedEmail(credentials.email);
      }

      // Handle redirect after successful login
      const redirectPath = sessionStorage.getItem("redirectAfterLogin");
      if (redirectPath) {
        sessionStorage.removeItem("redirectAfterLogin");
        router.push(redirectPath);
      } else {
        // Default redirect destination
        router.push("/");
      }

      return user;
    } catch (error) {
      // 에러 로깅 및 처리
      console.error("Login error:", error);
      throw error; // 에러를 상위로 전파
    } finally {
      setLoginLoading(false);
    }
  };

  /**
   * Register handler
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    setRegisterLoading(true);
    try {
      return await authService.register(userData);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    } finally {
      setRegisterLoading(false);
    }
  };

  /**
   * Logout handler
   */
  const logout = async () => {
    setLogoutLoading(true);
    try {
      await authService.logout();
      setUser(null);
      setTokenExpiration(null);
      setTokenRemainingTime(null);
      // Redirect to login page after logout
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    } finally {
      // setLogoutLoading(false);
    }
  };

  // Show loading state for initial authentication check only
  if (initialLoading || logoutLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Value provided to consumers of the context
  const value = {
    user,
    loading: {
      initial: initialLoading,
      login: loginLoading,
      register: registerLoading,
      logout: logoutLoading,
    },
    isAuthenticated: !!user,
    role: user?.role || null,
    login,
    register,
    logout,
    getRememberedEmail: authService.getRememberedEmail,
    validateAuth, // Expose the validation function to context consumers
    // 토큰 만료 관련 데이터
    tokenExpiration,
    tokenRemainingTime,
    formatRemainingTime, // 남은 시간을 포맷팅하는 함수 제공
    getFormattedRemainingTime: () => formatRemainingTime(tokenRemainingTime),
    isTokenExpired:
      tokenRemainingTime !== null ? tokenRemainingTime <= 0 : null,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use the Auth Context
 * @returns {Object} Auth context value
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
