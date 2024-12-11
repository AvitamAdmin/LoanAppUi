import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./Slice/slice"

const store = configureStore({
    reducer: {
      tasks: userReducer,
    },
  });

export default store;