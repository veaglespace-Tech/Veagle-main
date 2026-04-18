import { API_BASE_URL } from "@/lib/site";

export const AUTH_BACKEND_ROUTES = Object.freeze({
  register: "/api/auth/register",
  login: "/api/auth/login",
  verifyOtp: "/api/auth/verify-otp",
  profile: "/api/user/profile",
  sendOtp: "/api/auth/send-otp",
  changePassword: "/api/auth/change-password",
});

export function buildAuthBackendCandidates(path) {
  // Hostinger VPS: 82.112.237.155 / https://veaglespace.com
  // Localhost fallback removed for production
  return [`${API_BASE_URL}${path}`];
}
