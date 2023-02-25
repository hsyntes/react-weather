import { configureStore } from "@reduxjs/toolkit";
import animationsSlice from "./animations/animations-slice";
import locationSlice from "./location/location-slice";
import themeSlice from "./theme/theme-slice";

export const store = configureStore({
  reducer: {
    theme: themeSlice,
    location: locationSlice,
    animation: animationsSlice,
  },
});
