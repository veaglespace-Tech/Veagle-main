import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function buildApplicationFormData(payload) {
  const formData = new FormData();

  formData.append("name", payload.name?.trim() || "");
  formData.append("email", payload.email?.trim() || "");
  formData.append("phone", payload.phone?.trim() || "");
  formData.append("jobId", String(payload.jobId || ""));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return formData;
}

export const applicationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    submitJobApplication: builder.mutation({
      query: ({ token, ...payload }) => ({
        url: buildBackendUrl("/api/v1/applications"),
        method: "POST",
        headers: token ? authHeaders(token, false) : undefined,
        body: buildApplicationFormData(payload),
      }),
      invalidatesTags: ["Application", "PortalDashboard"],
    }),
    getApplications: builder.query({
      query: (token) => ({
        url: buildBackendUrl("/api/v1/admin/applications"),
        headers: authHeaders(token, false),
      }),
      providesTags: ["Application"],
    }),
    getApplicationsByJob: builder.query({
      query: ({ token, jobId }) => ({
        url: buildBackendUrl(`/api/v1/admin/applications/job/${jobId}`),
        headers: authHeaders(token, false),
      }),
      providesTags: ["Application"],
    }),
    updateApplicationStatus: builder.mutation({
      query: ({ token, id, status }) => ({
        url: buildBackendUrl(
          `/api/v1/admin/applications/${id}/status?status=${encodeURIComponent(status)}`
        ),
        method: "PATCH",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Application", "PortalDashboard"],
    }),
  }),
});

export const {
  useGetApplicationsByJobQuery,
  useGetApplicationsQuery,
  useSubmitJobApplicationMutation,
  useUpdateApplicationStatusMutation,
} = applicationsApi;
