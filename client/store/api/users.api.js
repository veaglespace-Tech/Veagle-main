import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: (token) => ({
        url: buildBackendUrl("/api/admin/users"),
        headers: authHeaders(token, false),
      }),
      providesTags: ["User"],
    }),
    getUserById: builder.query({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/admin/users/${id}`),
        headers: authHeaders(token, false),
      }),
      providesTags: (_result, _error, arg) => [{ type: "User", id: arg.id }],
    }),
    saveUser: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(id ? `/api/admin/users/${id}` : "/api/admin/users"),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token),
        body: {
          username: payload.username?.trim() || "",
          email: payload.email?.trim() || "",
          contact: payload.contact?.trim() || "",
          password: payload.password?.trim() || "",
          role: payload.role,
        },
      }),
      invalidatesTags: ["User", "PortalDashboard"],
    }),
    toggleUserStatus: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/admin/users/${id}/status`),
        method: "PATCH",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["User", "PortalDashboard"],
    }),
    deleteUser: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/admin/users/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["User", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteUserMutation,
  useGetUserByIdQuery,
  useGetUsersQuery,
  useSaveUserMutation,
  useToggleUserStatusMutation,
} = usersApi;
