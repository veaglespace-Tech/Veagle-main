import { configureStore } from "@reduxjs/toolkit";

import { baseApi } from "@/store/api/baseApi";
import portalReducer from "@/store/portalSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      [baseApi.reducerPath]: baseApi.reducer,
      portal: portalReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(baseApi.middleware),
  });
}
