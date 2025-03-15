/**
 * JWT 토큰 관련 유틸리티 함수
 * @module utils/tokenUtils
 */

/**
 * JWT 토큰에서 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {Object} 토큰에서 추출한 사용자 정보
 */
export function decodeToken(token) {
  try {
    if (!token) return {};

    // JWT 토큰은 점으로 구분된 3개 부분으로 구성됨
    const parts = token.split(".");
    if (parts.length !== 3) return {};

    // 두 번째 부분이 페이로드(사용자 정보)
    const payload = parts[1];

    // Base64 디코딩을 위한 패딩 처리
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );

    // Base64 디코딩 및 JSON 파싱
    const decoded = JSON.parse(atob(padded));

    return decoded;
  } catch (error) {
    console.warn("Failed to decode token", error);
    return {};
  }
}

/**
 * JWT 토큰에서 일반화된 사용자 정보 추출
 * @param {string} token - JWT 토큰
 * @returns {Object} 표준화된 사용자 정보
 */
export function extractUserInfoFromToken(token) {
  try {
    const decoded = decodeToken(token);
    if (!decoded || Object.keys(decoded).length === 0) return {};

    // 토큰에 포함될 수 있는 일반적인 사용자 정보 필드 추출
    // email이나 sub에서 @ 앞 부분을 이름으로 사용
    const emailOrSub = decoded.email || decoded.sub;
    const name = emailOrSub ? emailOrSub.split("@")[0] : "";

    return {
      id: decoded.id || decoded.sub || decoded.user_id,
      email: decoded.email || decoded.sub,
      name: name,
      role: decoded.role || decoded.memberType || decoded.permissions,
      exp: decoded.exp,
    };
  } catch (error) {
    console.warn("Failed to extract user info from token", error);
    return {};
  }
}

/**
 * JWT 토큰 만료 여부 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} 토큰 만료 여부 (만료: true, 유효: false)
 */
export function isTokenExpired(token) {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  } catch (error) {
    console.warn("Failed to check token expiration", error);
    return true; // 오류 발생 시 만료된 것으로 처리
  }
}

/**
 * JWT 토큰이 유효한지 확인
 * @param {string} token - JWT 토큰
 * @returns {boolean} 토큰 유효 여부
 */
export function isValidToken(token) {
  return !!token && !isTokenExpired(token);
}

/**
 * 사용자 역할 정규화 (ROLE_ 접두사 처리 등)
 * @param {string} role - 원본 역할 문자열
 * @returns {string} 정규화된 역할 문자열
 */
export function normalizeRole(role) {
  if (!role) return "";

  // role이 문자열인지 확인
  if (typeof role !== "string") {
    return role;
  }

  // 일관성을 위해 모든 역할을 대문자로 변환
  const upperRole = role.toUpperCase();

  // ROLE_ 접두사 처리 (보존 또는 제거에 따라 선택)
  // 현재는 접두사를 보존하는 방식으로 설정
  return upperRole;
}

/**
 * 사용자가 특정 역할을 가지고 있는지 확인
 * @param {Object} user - 사용자 객체
 * @param {string|Array<string>} requiredRoles - 필요한 역할 또는 역할 배열
 * @returns {boolean} 역할 보유 여부
 */
export function hasRole(user, requiredRoles) {
  if (!user) return false;

  // user.memberType 또는 user.role을 확인
  const userRole = user.memberType || user.role;

  if (!userRole) return false;

  // 사용자 역할 정규화
  const normalizedUserRole = normalizeRole(userRole);

  // 실제 역할 비교 (디버깅용 로그)
  console.log("User role (normalized):", normalizedUserRole);

  // 배열로 전달된 경우 하나라도 일치하면 true
  if (Array.isArray(requiredRoles)) {
    const result = requiredRoles.some((role) => {
      const normalizedRequiredRole = normalizeRole(role);

      return normalizedRequiredRole === normalizedUserRole;
    });

    console.log("Role check result:", result);
    return result;
  }

  // 단일 역할로 전달된 경우
  const normalizedRequiredRole = normalizeRole(requiredRoles);

  const result = normalizedRequiredRole === normalizedUserRole;
  console.log("Role check result:", result);
  return result;
}
