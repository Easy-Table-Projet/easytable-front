"use client";

import { useRouter } from "next/navigation";

/**
 * 접근 제한 페이지 컴포넌트
 */
export default function AccessDenied() {
  const router = useRouter();

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <svg
          className="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">접근 제한됨</h2>
        <p className="text-gray-600 mb-6">
          레스토랑 소유자만 이 페이지에 접근할 수 있습니다.
        </p>
        <button
          onClick={() => router.push("/")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium w-full"
        >
          홈으로 돌아가기
        </button>
      </div>
    </div>
  );
}
