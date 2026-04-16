import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function normalizeFeature(feature) {
  const name =
    typeof feature === "string" ? feature.trim() : String(feature?.name || "").trim();

  return name ? { name } : null;
}

function buildServiceFormData(payload) {
  const formData = new FormData();
  const body = {
    title: payload.title?.trim() || "",
    description: payload.description?.trim() || "",
    detailTitle: payload.detailTitle?.trim() || "",
    detailDescription: payload.detailDescription?.trim() || "",
    features: (payload.features || []).map(normalizeFeature).filter(Boolean),
  };

  if (payload.pageContent !== undefined) {
    body.pageContent = payload.pageContent;
  }

  formData.append("data", JSON.stringify(body));

  if (payload.file) {
    formData.append("file", payload.file);
  }

  return formData;
}

export const servicesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getServices: builder.query({
      query: (keyword = "") =>
        buildBackendUrl(
          `/api/v1/services${
            keyword ? `?keyword=${encodeURIComponent(keyword)}` : ""
          }`
        ),
      providesTags: ["Service"],
    }),
    getServiceById: builder.query({
      query: (id) => buildBackendUrl(`/api/v1/services/${id}`),
      providesTags: (_result, _error, id) => [{ type: "Service", id }],
    }),
    saveService: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(
          id ? `/api/v1/admin/services/${id}` : "/api/v1/admin/services"
        ),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token, false),
        body: buildServiceFormData(payload),
      }),
      invalidatesTags: ["Service", "PortalDashboard"],
    }),
    deleteService: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/v1/admin/services/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Service", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteServiceMutation,
  useGetServiceByIdQuery,
  useGetServicesQuery,
  useSaveServiceMutation,
} = servicesApi;
