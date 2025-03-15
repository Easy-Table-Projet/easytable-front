"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken, isTokenExpired } from "@/utils/tokenUtils";

/**
 * 클라이언트 컴포넌트에서 localStorage를 통해 세션 정보 가져오기
 * @returns {Object|null} 사용자 정보 또는 null
 */
function getSession() {
  // 브라우저 환경인지 확인
  if (typeof window === "undefined") {
    return null;
  }

  const token = localStorage.getItem("authToken");

  if (!token) {
    return null;
  }

  try {
    // JWT 디코딩하여 사용자 정보 추출
    const decoded = decodeToken(token);

    // 토큰 만료 확인
    if (isTokenExpired(token)) {
      localStorage.removeItem("authToken"); // 만료된 토큰 제거
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("authToken"); // 유효하지 않은 토큰 제거
    return null;
  }
}

export default function OwnerLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 세션 정보 가져오기
    const sessionUser = getSession();
    setUser(sessionUser);

    // 인증되지 않은 경우 로그인 페이지로 리디렉션
    if (!sessionUser) {
      router.push("/auth/login");
      return;
    }

    setIsLoading(false);
  }, [router]);

  // 로딩 중인 경우 로딩 표시
  if (isLoading) {
    return;
  }

  return <>{children}</>;
}
