import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fetchFilterInput: [],
  advanceSearch: {},
  multipleEditRecordId: [],
  deleteElementId: "", // This will store a single ID or be empty
  token: "",
  selectedRole: [],
  ChooseEditOrAdd: "",
  deleteStatus: "",
  reloadSavedQuery: "",
  cronExpression:"",
  toolkitRoutePath:"",
  highlightSearchQuery:"",
  pageNumber: 0,
  configureListingPageModal:[]
};

const userSlice = createSlice({
  name: "zero",
  initialState,
  reducers: {
    getFilterInputValue: (state, { payload }) => {
      state.fetchFilterInput = Array.isArray(payload) ? payload : [payload];
    },
    setAdvanceFilterValue: (state, { payload }) => {
      state.advanceSearch = payload;
    },
    resetAdvanceFilterValue: (state, { payload }) => {
      state.advanceSearch = {};
    },
    sethighlightSearchQuery: (state, { payload }) => {
      state.highlightSearchQuery = payload;
    },
    setFilterInputValueEmpty: (state, { payload }) => {
      state.fetchFilterInput =[];
    },
    setMultipleEditRecoedId: (state, { payload }) => {
      if (Array.isArray(payload)) {
        // If the payload is an array (e.g., Select All), replace the entire state
        state.multipleEditRecordId = payload;
      } else {
        // Handle individual record selection
        const index = state.multipleEditRecordId.indexOf(payload);
        if (index > -1) {
          // Remove if already selected
          state.multipleEditRecordId = state.multipleEditRecordId.filter(
            (id) => id !== payload
          );
        } else {
          // Add if not selected
          state.multipleEditRecordId.push(payload);
        }
      }
    },

    clearAllEditRecordIds: (state) => {
      state.multipleEditRecordId = [];
    },

    getdeleteElementId: (state, { payload }) => {
      state.deleteElementId = payload;
    },
    clearDeleteElementId: (state) => {
      state.deleteElementId = "";
    },

    setToken: (state, { payload }) => {
      state.token = payload;
    },

    setSelectedRoleId: (state, { payload }) => {
      const newSelectedRole = [...state.selectedRole];
      payload.forEach((item) => {
        const index = newSelectedRole.findIndex(
          (t) => t.recordId === item.recordId
        );
        if (index > -1) {
          newSelectedRole.splice(index, 1);
        } else {
          newSelectedRole.push(item);
        }
      });
      state.selectedRole = newSelectedRole;
    },

    setChooseEditOrAdd: (state, { payload }) => {
      state.ChooseEditOrAdd = payload;
    },

    triggerDeleteSuccess: (state) => {
      state.deleteStatus = "deleted";
    },
    resetDeleteStatus: (state) => {
      state.deleteStatus = "";
    },
    setReloadSavedQuery: (state) => {
      state.reloadSavedQuery = "reloadSavedquery";
    },
    setEmptyReloadSavedQuery: (state) => {
      state.reloadSavedQuery = "";
    },
    deleteCronExpression: (state) => {
      state.cronExpression = "";
    },
    getCronExpression: (state, { payload }) => {
      state.cronExpression = payload;
    },
    setToolkitRoutePath: (state, { payload }) => {
      state.toolkitRoutePath = payload;
    },
    setPageNumber: (state, { payload }) => {
      state.pageNumber = payload; // Update the page
    },
    resetPageNumber: (state) => {
      state.pageNumber = 0; // Reset page to 0
    },
    setConfigureListingPageModal: (state, { payload }) => {
      state.configureListingPageModal = payload; // Update the page
    }
  },
});

export default userSlice.reducer;
export const {
  getFilterInputValue,
  setAdvanceFilterValue,
  setMultipleEditRecoedId,
  clearAllEditRecordIds,
  getdeleteElementId,
  clearDeleteElementId,
  setToken,
  setSelectedRoleId,
  setChooseEditOrAdd,
  triggerDeleteSuccess,
  resetDeleteStatus,
  getCronExpression,
  deleteCronExpression,
  setToolkitRoutePath,
  setPageNumber,
  resetPageNumber,
  setFilterInputValueEmpty,
  setConfigureListingPageModal,
  resetAdvanceFilterValue,
  sethighlightSearchQuery,
  setEmptyReloadSavedQuery,
  setReloadSavedQuery
} = userSlice.actions;