import { configureStore } from "@reduxjs/toolkit";

import portalReducer from "@/store/portalSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      portal: portalReducer,
    },
  });
}
