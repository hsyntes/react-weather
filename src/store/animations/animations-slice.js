import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  spinner: {
    rotateZ: [0, -360],
    boxShadow: [
      "0 0 0px rgba(254, 21, 1, 0)",
      "0 0 50px rgba(254, 212, 1, 0.35)",
      "0 0 0px rgba(254, 21, 1, 0)",
    ],
  },

  splash: {
    scale: [1, 1.1, 1.15, 1, 1, 1.1, 1.15, 1],
    rotateZ: [0, 0, -180, -360, -360, -180, 0, 0],
    borderRadius: [
      "100%",
      "25%",
      "100%",
      "100%",
      "100%",
      "25%",
      "100%",
      "100%",
    ],
    boxShadow: [
      "0 0 0px rgba(254, 21, 1, 0)",
      "0 0 50px rgba(254, 212, 1, 0.35)",
      "0 0 25px rgba(254, 212, 1, 0.17.5)",
      "0 0 0px rgba(254, 212, 1, 0)",
      "0 0 0px rgba(254, 21, 1, 0)",
      "0 0 50px rgba(254, 212, 1, 0.35)",
      "0 0 25px rgba(254, 212, 1, 0.17.5)",
      "0 0 0px rgba(254, 212, 1, 0)",
    ],
  },
};

const animationsSlice = createSlice({
  name: "animation",
  initialState,
  reducers(state) {
    return state;
  },
});

export default animationsSlice.reducer;
