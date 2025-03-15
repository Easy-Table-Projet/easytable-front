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

/**
 * 로그인되지 않은 사용자만 접근할 수 있는 레이아웃 컴포넌트
 */
export default function AuthLayout({ children }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage에서 세션 정보 가져오기
    const sessionUser = getSession();

    // 이미 로그인된 사용자는 홈 페이지로 리디렉션
    if (sessionUser) {
      router.push("/");
      return;
    }

    // 로그인되지 않은 경우에만 컨텐츠 표시
    setIsLoading(false);
  }, [router]);

  // 로딩 중인 경우 로딩 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
