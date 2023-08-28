"use client";

import { initWallet } from "@/features/walletSlice";
import { ThemeProvider } from "next-themes";
import { memo, useEffect } from "react";
import { useDispatch } from "react-redux";

const Providers = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      initWallet({
        contractId: process.env.NEXT_PUBLIC_CONTRACT_NAME,
        network: "testnet",
      }),
    );
  }, []);

  return <ThemeProvider attribute="class">{children}</ThemeProvider>;
};

export default memo(Providers);
