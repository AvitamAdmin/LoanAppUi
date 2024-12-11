// Providers.js
"use client"

import { Provider } from "react-redux";
import store from "./store"; // Adjust the path if necessary

export const Providers = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
