import { authHeaders } from "@/lib/portal-api";
import { buildLeadPayload, mapLeadRecord } from "@/lib/leads";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

export const cmsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSiteContent: builder.query({
      query: (token) => ({
        url: "/api/cms/content",
        headers: authHeaders(token, false),
      }),
      providesTags: ["SiteContent"],
    }),
    updateSiteContent: builder.mutation({
      query: ({ token, content }) => ({
        url: "/api/cms/content",
        method: "PUT",
        headers: authHeaders(token),
        body: content,
      }),
      invalidatesTags: ["SiteContent", "PortalDashboard"],
    }),
    getLeads: builder.query({
      query: (token) => ({
        url: buildBackendUrl("/api/v1/admin/contacts"),
        headers: authHeaders(token, false),
      }),
      transformResponse: (response) =>
        Array.isArray(response) ? response.map((item) => mapLeadRecord(item)) : [],
      providesTags: ["Lead"],
    }),
    submitLead: builder.mutation({
      query: (body) => ({
        url: buildBackendUrl("/api/v1/contacts"),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: buildLeadPayload(body),
      }),
      invalidatesTags: ["Lead", "PortalDashboard"],
    }),
    updateLeadStatus: builder.mutation({
      async queryFn({ token, id, status }, _api, _extraOptions, baseQuery) {
        if (!id) {
          return {
            error: {
              status: 400,
              data: { error: "Lead id is required" },
              message: "Lead id is required",
            },
          };
        }

        if (!status || status === "new") {
          return { data: { ok: true } };
        }

        const result = await baseQuery({
          url: buildBackendUrl(`/api/v1/admin/contacts/${encodeURIComponent(id)}/read`),
          method: "PATCH",
          headers: authHeaders(token, false),
        });

        if (result.error) {
          return { error: result.error };
        }

        return { data: result.data };
      },
      invalidatesTags: ["Lead", "PortalDashboard"],
    }),
    getTasks: builder.query({
      query: (token) => ({
        url: "/api/cms/tasks",
        headers: authHeaders(token, false),
      }),
      providesTags: ["Task"],
    }),
    saveTask: builder.mutation({
      query: ({ token, ...task }) => ({
        url: "/api/cms/tasks",
        method: task.id ? "PATCH" : "POST",
        headers: authHeaders(token),
        body: task.id ? { id: task.id, ...task } : task,
      }),
      invalidatesTags: ["Task", "PortalDashboard"],
    }),
    deleteTask: builder.mutation({
      query: ({ token, id }) => ({
        url: `/api/cms/tasks?id=${encodeURIComponent(id)}`,
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Task", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteTaskMutation,
  useGetLeadsQuery,
  useGetSiteContentQuery,
  useGetTasksQuery,
  useSaveTaskMutation,
  useSubmitLeadMutation,
  useUpdateLeadStatusMutation,
  useUpdateSiteContentMutation,
} = cmsApi;
