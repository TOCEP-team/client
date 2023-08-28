"use client";

import { Provider } from "react-redux";
import { store } from "./store";
import Web3Provider from "./Web3Provider";
import { ThemeProvider } from "@material-tailwind/react";

const Providers = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Web3Provider>
          {children}
        </Web3Provider>
      </ThemeProvider>
    </Provider>
  );
};

export default Providers;
