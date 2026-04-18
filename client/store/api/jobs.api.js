import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

export const jobsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getJobs: builder.query({
      query: (keyword = "") =>
        buildBackendUrl(
          `/api/public/jobs${keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""}`
        ),
      providesTags: ["Job"],
    }),
    saveJob: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(id ? `/api/admin/jobs/${id}` : "/api/admin/jobs"),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token),
        body: {
          title: payload.title?.trim() || "",
          description: payload.description?.trim() || "",
          location: payload.location?.trim() || "",
          skills: payload.skills?.trim() || "",
        },
      }),
      invalidatesTags: ["Job", "PortalDashboard"],
    }),
    updateJobStatus: builder.mutation({
      query: ({ token, id, status }) => ({
        url: buildBackendUrl(
          `/api/admin/jobs/${id}/status?status=${encodeURIComponent(status)}`
        ),
        method: "PATCH",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Job", "PortalDashboard"],
    }),
    deleteJob: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/admin/jobs/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Job", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteJobMutation,
  useGetJobsQuery,
  useSaveJobMutation,
  useUpdateJobStatusMutation,
} = jobsApi;
