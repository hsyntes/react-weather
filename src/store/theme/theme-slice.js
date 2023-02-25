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
  if (currentDate < sunset || currentDate > sunrise)
    dispatch(themeSliceActions.switchTheme("light"));
  if (currentDate > sunset || currentDate < sunrise)
    dispatch(themeSliceActions.switchTheme("dark"));
};

export const themeSliceActions = themeSlice.actions;
export default themeSlice.reducer;
