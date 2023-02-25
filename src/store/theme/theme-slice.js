import { createSlice } from "@reduxjs/toolkit";

// Initial state for theme
const initialState = {
  theme: null,
};

// Theme slice
const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    switchTheme(state, action) {
      const { payload } = action;

      state.theme = payload;
      document.querySelector("html").setAttribute("data-bs-theme", state.theme);

      return state;
    },
  },
});

// Redux thunk
export const setTheme = (currentDate, sunrise, sunset) => (dispatch) => {
  if (currentDate > sunrise && currentDate < sunset)
    dispatch(themeSliceActions.switchTheme("light"));
  else dispatch(themeSliceActions.switchTheme("dark"));
};

export const themeSliceActions = themeSlice.actions;
export default themeSlice.reducer;
