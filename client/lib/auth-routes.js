import { API_BASE_URL } from "@/lib/site";

export const AUTH_BACKEND_ROUTES = Object.freeze({
  register: "/api/v1/auth/register",
  login: "/api/v1/auth/login",
  verifyOtp: "/api/verify-otp",
  profile: "/api/v1/users/profile",
  sendOtp: "/api/v1/auth/send-otp",
  changePassword: "/api/v1/auth/change-password",
});

export function buildAuthBackendCandidates(path) {
  const fallbackBaseUrl = API_BASE_URL.includes("localhost")
    ? API_BASE_URL.replace("localhost", "127.0.0.1")
    : API_BASE_URL;

  return [...new Set([`${API_BASE_URL}${path}`, `${fallbackBaseUrl}${path}`])];
}
