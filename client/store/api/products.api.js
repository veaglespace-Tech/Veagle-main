import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function buildProductFormData(payload) {
  const formData = new FormData();

  formData.append(
    "request",
    JSON.stringify({
      title: payload.title?.trim() || "",
      description: payload.description?.trim() || "",
      imageUrl: payload.imageUrl || "",
      categoryId: Number(payload.categoryId),
      isActive: payload.isActive !== false,
    })
  );

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return formData;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => buildBackendUrl("/api/public/products"),
      providesTags: ["Product"],
    }),
    saveProduct: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(
          id ? `/api/admin/products/${id}` : "/api/admin/products"
        ),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token, false),
        body: buildProductFormData(payload),
      }),
      invalidatesTags: ["Product", "PortalDashboard"],
    }),
    toggleProductStatus: builder.mutation({
      query: ({ token, id, isActive }) => ({
        url: buildBackendUrl(`/api/admin/products/${id}/status`),
        method: "PATCH",
        headers: authHeaders(token),
        body: { isActive },
      }),
      invalidatesTags: ["Product", "PortalDashboard"],
    }),
    deleteProduct: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/admin/products/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Product", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteProductMutation,
  useGetProductsQuery,
  useSaveProductMutation,
  useToggleProductStatusMutation,
} = productsApi;
