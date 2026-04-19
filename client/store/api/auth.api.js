import {
  AUTH_BACKEND_ROUTES,
  resolveLoginBackendRoute,
} from "@/lib/auth-routes";
import { authHeaders } from "@/lib/portal-api";
import { normalizeRole } from "@/lib/utils";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function normalizeAuthResponse(payload) {
  if (!payload || typeof payload !== "object") {
    return payload;
  }

  return {
    ...payload,
    normalizedRole: normalizeRole(payload.normalizedRole || payload.role || ""),
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (body) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.register),
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation({
      query: ({ role, ...body }) => ({
        url: buildBackendUrl(resolveLoginBackendRoute(role)),
        method: "POST",
        body,
      }),
      transformResponse: (payload) => {
        if (typeof payload === "string") {
          return {
            message: payload,
            otpRequired: true,
          };
        }

        return normalizeAuthResponse(payload);
      },
    }),
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.verifyOtp),
        method: "POST",
        body,
      }),
      transformResponse: (payload) => normalizeAuthResponse(payload),
    }),
    resetPassword: builder.mutation({
      query: ({ token, password }) => ({
        url: buildBackendUrl(`${AUTH_BACKEND_ROUTES.resetPassword}?token=${encodeURIComponent(token || "")}`),
        method: "POST",
        body: {
          password: password || "",
        },
      }),
    }),
    resetPasswordLinkSend: builder.mutation({
      query: (email) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.resetPasswordLinkSend),
        method: "POST",
        body: email,
      }),
    }),
    getProfile: builder.query({
      query: (token) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.profile),
        headers: authHeaders(token, false),
      }),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation({
      query: ({ token, ...body }) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.profile),
        method: "PUT",
        headers: authHeaders(token),
        body,
      }),
      invalidatesTags: ["Profile"],
    }),
    sendOtp: builder.mutation({
      query: (token) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.sendOtp),
        method: "POST",
        headers: authHeaders(token, false),
      }),
    }),
    changePassword: builder.mutation({
      query: ({ token, ...body }) => ({
        url: buildBackendUrl(AUTH_BACKEND_ROUTES.changePassword),
        method: "PUT",
        headers: authHeaders(token),
        body,
      }),
    }),
  }),
});

export const {
  useChangePasswordMutation,
  useGetProfileQuery,
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordLinkSendMutation,
  useResetPasswordMutation,
  useSendOtpMutation,
  useUpdateProfileMutation,
  useVerifyOtpMutation,
} = authApi;
