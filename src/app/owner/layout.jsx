"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken, hasRole, isTokenExpired } from "@/utils/tokenUtils";
import AccessDenied from "@/components/common/AccessDenied";

/**
 * 클라이언트 컴포넌트에서 인증 상태 확인
 * @returns {Object|null} 사용자 정보 또는 null
 */
function getClientSession() {
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
 * Owner 경로를 위한 레이아웃 (클라이언트 컴포넌트)
 * 클라이언트 사이드에서 권한을 검사하고 적절히 리디렉션
 */
export default function OwnerLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = getClientSession();

    // 인증되지 않은 경우 로그인 페이지로 리디렉션
    if (!session) {
      router.push("/auth/login");
      return;
    }

    // OWNER 역할 확인
    const isOwner = hasRole(session, ["OWNER", "ROLE_OWNER"]);
    if (!isOwner) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }

    setIsLoading(false);
  }, [router]);

  // 로딩 중인 경우 로딩 표시
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Owner 권한이 없는 경우 접근 거부 페이지 표시
  if (!isAuthorized) {
    return <AccessDenied />;
  }

  // Owner 권한이 있는 경우 페이지 표시
  return <>{children}</>;
}
