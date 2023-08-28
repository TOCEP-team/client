import { configureStore } from "@reduxjs/toolkit";
import walletSlice from "@/features/walletSlice";

export const store = configureStore({
  reducer: {
    wallet: walletSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
