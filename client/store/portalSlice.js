import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { defaultContent } from "@/lib/cms/default-content";
import { fetchPortalDashboard } from "@/lib/portal-api";

function createInitialContent() {
  return JSON.parse(JSON.stringify(defaultContent));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function mergeWithDefaults(baseValue, overrideValue) {
  if (Array.isArray(baseValue)) {
    return Array.isArray(overrideValue) ? overrideValue : baseValue;
  }

  if (!isPlainObject(baseValue)) {
    return overrideValue === undefined ? baseValue : overrideValue;
  }

  const output = { ...baseValue };

  for (const key of Object.keys(overrideValue || {})) {
    output[key] = mergeWithDefaults(baseValue[key], overrideValue[key]);
  }

  return output;
}

function createInitialState() {
  return {
    session: null,
    sessionReady: false,
    loading: true,
    busyAction: "",
    error: "",
    notice: "",
    activeTab: "overview",
    content: createInitialContent(),
    services: [],
    products: [],
    categories: [],
    jobs: [],
    clients: [],
    portfolio: [],
    applications: [],
    users: [],
    leads: [],
    tasks: [],
  };
}

export const loadPortalDashboard = createAsyncThunk(
  "portal/loadDashboard",
  async (session, { rejectWithValue }) => {
    try {
      return await fetchPortalDashboard(session);
    } catch (error) {
      return rejectWithValue(error.message || "Failed to load portal data.");
    }
  }
);

const portalSlice = createSlice({
  name: "portal",
  initialState: createInitialState(),
  reducers: {
    resetPortalState() {
      return createInitialState();
    },
    setSession(state, action) {
      state.session = action.payload;
    },
    clearSession(state) {
      state.session = null;
    },
    setSessionReady(state, action) {
      state.sessionReady = action.payload;
    },
    setBusyAction(state, action) {
      state.busyAction = action.payload;
    },
    setPortalNotice(state, action) {
      state.notice = action.payload;
      state.error = "";
    },
    setPortalError(state, action) {
      state.error = action.payload;
      state.notice = "";
    },
    clearPortalFeedback(state) {
      state.notice = "";
      state.error = "";
    },
    setActiveTab(state, action) {
      state.activeTab = action.payload;
    },
    setContent(state, action) {
      state.content = mergeWithDefaults(defaultContent, action.payload || {});
    },
    updateContentField(state, action) {
      const { section, key, value } = action.payload;
      state.content[section][key] = value;
    },
    updateContentList(state, action) {
      const { section, index, key, value } = action.payload;
      state.content[section][index][key] = value;
    },
    addContentListItem(state, action) {
      const { section, template } = action.payload;
      state.content[section].push({ ...template });
    },
    removeContentListItem(state, action) {
      const { section, index } = action.payload;
      state.content[section].splice(index, 1);
    },
    updateNestedContentField(state, action) {
      const { section, key, value } = action.payload;
      state.content[section][key] = value;
    },
    updateNestedContentList(state, action) {
      const { section, listKey, index, key, value } = action.payload;
      state.content[section][listKey][index][key] = value;
    },
    addNestedContentListItem(state, action) {
      const { section, listKey, template } = action.payload;
      state.content[section][listKey].push({ ...template });
    },
    removeNestedContentListItem(state, action) {
      const { section, listKey, index } = action.payload;
      state.content[section][listKey].splice(index, 1);
    },
    updateNestedStringListItem(state, action) {
      const { section, listKey, index, value } = action.payload;
      state.content[section][listKey][index] = value;
    },
    addNestedStringListItem(state, action) {
      const { section, listKey } = action.payload;
      state.content[section][listKey].push("");
    },
    removeNestedStringListItem(state, action) {
      const { section, listKey, index } = action.payload;
      state.content[section][listKey].splice(index, 1);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadPortalDashboard.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loadPortalDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.content = mergeWithDefaults(defaultContent, action.payload.content || {});
        state.leads = action.payload.leads || [];
        state.tasks = action.payload.tasks || [];
        state.services = action.payload.services || [];
        state.products = action.payload.products || [];
        state.categories = action.payload.categories || [];
        state.jobs = action.payload.jobs || [];
        state.clients = action.payload.clients || [];
        state.portfolio = action.payload.portfolio || [];
        state.applications = action.payload.applications || [];
        state.users = action.payload.users || [];
        if (action.payload.fallbackUsed) {
          state.notice =
            "Some backend dashboard data is unavailable right now. Showing empty sections where APIs did not respond.";
        }
      })
      .addCase(loadPortalDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message || "Failed to load portal data.";
      });
  },
});

export const {
  addContentListItem,
  addNestedContentListItem,
  addNestedStringListItem,
  clearPortalFeedback,
  clearSession,
  removeContentListItem,
  removeNestedContentListItem,
  removeNestedStringListItem,
  resetPortalState,
  setActiveTab,
  setBusyAction,
  setContent,
  setPortalError,
  setPortalNotice,
  setSession,
  setSessionReady,
  updateContentField,
  updateContentList,
  updateNestedContentField,
  updateNestedContentList,
  updateNestedStringListItem,
} = portalSlice.actions;

export default portalSlice.reducer;
