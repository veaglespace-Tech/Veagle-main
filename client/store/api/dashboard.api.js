import { fetchPortalDashboard } from "@/lib/portal-api";
import { baseApi } from "@/store/api/baseApi";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortalDashboard: builder.query({
      async queryFn(session) {
        try {
          const data = await fetchPortalDashboard(session);
          return { data };
        } catch (error) {
          return {
            error: {
              status: error?.status || "CUSTOM_ERROR",
              data: error?.payload || null,
              message: error?.message || "Failed to load portal dashboard.",
            },
          };
        }
      },
      providesTags: [
        "PortalDashboard",
        "SiteContent",
        "Lead",
        "Task",
        "Service",
        "Product",
        "Category",
        "Job",
        "Client",
        "Portfolio",
        "Application",
        "User",
      ],
    }),
  }),
});

export const {
  useGetPortalDashboardQuery,
  useLazyGetPortalDashboardQuery,
} = dashboardApi;
