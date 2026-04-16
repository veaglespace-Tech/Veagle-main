import { authHeaders } from "@/lib/portal-api";
import { baseApi, buildBackendUrl } from "@/store/api/baseApi";

function buildClientFormData(payload) {
  const formData = new FormData();

  formData.append("name", payload.name?.trim() || "");
  formData.append("websiteUrl", payload.websiteUrl?.trim() || "");
  formData.append("description", payload.description?.trim() || "");

  if (payload.displayOrder) {
    formData.append("displayOrder", String(payload.displayOrder).trim());
  }

  if (payload.file) {
    formData.append("logo", payload.file);
  }

  return formData;
}

export const clientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClients: builder.query({
      query: () => buildBackendUrl("/api/v1/clients"),
      providesTags: ["Client"],
    }),
    getClientById: builder.query({
      query: (id) => buildBackendUrl(`/api/v1/clients/${id}`),
      providesTags: (_result, _error, id) => [{ type: "Client", id }],
    }),
    saveClient: builder.mutation({
      query: ({ token, id, ...payload }) => ({
        url: buildBackendUrl(
          id ? `/api/v1/admin/clients/${id}` : "/api/v1/admin/clients"
        ),
        method: id ? "PUT" : "POST",
        headers: authHeaders(token, false),
        body: buildClientFormData(payload),
      }),
      invalidatesTags: ["Client", "PortalDashboard"],
    }),
    deleteClient: builder.mutation({
      query: ({ token, id }) => ({
        url: buildBackendUrl(`/api/v1/admin/clients/${id}`),
        method: "DELETE",
        headers: authHeaders(token, false),
      }),
      invalidatesTags: ["Client", "PortalDashboard"],
    }),
  }),
});

export const {
  useDeleteClientMutation,
  useGetClientByIdQuery,
  useGetClientsQuery,
  useSaveClientMutation,
} = clientsApi;
