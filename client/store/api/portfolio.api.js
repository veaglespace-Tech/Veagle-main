import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function buildPortfolioFormData(payload) {
  const formData = new FormData();

  formData.append("title", payload.title?.trim() || "");
  formData.append("description", payload.description?.trim() || "");
  formData.append("projectUrl", payload.projectUrl?.trim() || "");
  formData.append("githubUrl", payload.githubUrl?.trim() || "");

  if (payload.file) {
    formData.append("image", payload.file);
  }

  return formData;
}

export const portfolioApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPortfolio: builder.query({
      query: () => buildBackendUrl("/api/v1/portfolio"),
      providesTags: ["Portfolio"],
    }),
    getPortfolioById: builder.query({
      query: (id) => buildBackendUrl(`/api/v1/portfolio/${id}`),
      providesTags: (_result, _error, id) => [{ type: "Portfolio", id }],
    }),
    savePortfolio: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(
          id ? `/api/v1/admin/portfolio/${id}` : "/api/v1/admin/portfolio"
        ),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token, false),
        body: buildPortfolioFormData(payload),
      }),
      invalidatesTags: ["Portfolio", "PortalDashboard"],
    }),
    deletePortfolio: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/v1/admin/portfolio/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Portfolio", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeletePortfolioMutation,
  useGetPortfolioByIdQuery,
  useGetPortfolioQuery,
  useSavePortfolioMutation,
} = portfolioApi;
