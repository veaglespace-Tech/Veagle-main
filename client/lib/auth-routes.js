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
  // Hostinger VPS: 82.112.237.155 / https://veaglespace.com
  // Localhost fallback removed for production
  return [`${API_BASE_URL}${path}`];
}
