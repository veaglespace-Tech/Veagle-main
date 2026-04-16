import { authHeaders } from "@/lib/portal-api";
import { baseApi } from "@/store/api/baseApi";

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
        url: "/api/cms/leads",
        headers: authHeaders(token, false),
      }),
      providesTags: ["Lead"],
    }),
    submitLead: builder.mutation({
      query: (body) => ({
        url: "/api/cms/leads",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Lead", "PortalDashboard"],
    }),
    updateLeadStatus: builder.mutation({
      query: ({ token, id, status }) => ({
        url: "/api/cms/leads",
        method: "PATCH",
        headers: authHeaders(token),
        body: { id, status },
      }),
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
