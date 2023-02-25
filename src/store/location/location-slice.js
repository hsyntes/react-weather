import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  location: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    locate(state, action) {
      const { payload } = action;

      state.location = payload;

      return state;
    },
  },
});

export const locationSliceActions = locationSlice.actions;
export default locationSlice.reducer;
