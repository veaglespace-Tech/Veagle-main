import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => buildBackendUrl("/api/v1/categories"),
      providesTags: ["Category"],
    }),
    getCategoryById: builder.query({
      query: (id) => buildBackendUrl(`/api/v1/categories/${id}`),
      providesTags: (_result, _error, id) => [{ type: "Category", id }],
    }),
    saveCategory: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(
          id ? `/api/v1/admin/categories/${id}` : "/api/v1/admin/categories"
        ),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token),
        body: {
          name: payload.name?.trim() || "",
          description: payload.description?.trim() || "",
        },
      }),
      invalidatesTags: ["Category", "PortalDashboard"],
    }),
    deleteCategory: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/v1/admin/categories/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Category", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useSaveCategoryMutation,
} = categoriesApi;
