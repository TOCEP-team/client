import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Wallet } from "@/utils/near-wallet";

const initialState = {
  wallet: null,
  isLoading: true,
};

export const initWallet = createAsyncThunk(
  "wallet/init",
  async ({ contractId, network }) => {
    const wallet = new Wallet({
      createAccessKeyFor: contractId,
      network,
    });

    await wallet.startUp().catch((e) => {
      console.error("Wallet start up failed", e);
    });

    return wallet;
  },
);

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    logout: (state) => {
      state.wallet = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(initWallet.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(initWallet.fulfilled, (state, action) => {
      if (!state.wallet) state.wallet = action.payload;

      state.isLoading = false;
    });
    builder.addCase(initWallet.rejected, (state) => {
      state.wallet = null;
    });
  },
});

export const { logout } = walletSlice.actions;
export default walletSlice.reducer;

export const selectWallet = (state) => state.wallet.wallet;
export const selectAccountId = (state) => state.wallet.wallet?.accountId;
export const selectIsConnected = (state) => !!state.wallet.wallet?.accountId;
export const selectIsLoading = (state) => state.wallet.isLoading;
