import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { API_BASE_URL } from "@/lib/site";

async function parseResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

export function buildBackendUrl(path = "") {
  return `${API_BASE_URL}${path}`;
}

export function getErrorMessage(error, fallback = "Request failed.") {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error?.data === "string" && error.data.trim()) {
    return error.data;
  }

  if (error?.data && typeof error.data === "object") {
    return (
      error.data.error ||
      error.data.message ||
      error.message ||
      fallback
    );
  }

  return error.error || error.message || fallback;
}

const rawBaseQuery = fetchBaseQuery({
  baseUrl: "",
  credentials: "same-origin",
  responseHandler: parseResponse,
});

async function baseQuery(args, api, extraOptions) {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    return {
      error: {
        ...result.error,
        message: getErrorMessage(result.error),
      },
    };
  }

  return result;
}

export const baseApi = createApi({
  reducerPath: "veagleApi",
  baseQuery,
  tagTypes: [
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
    "Profile",
  ],
  endpoints: () => ({}),
});
