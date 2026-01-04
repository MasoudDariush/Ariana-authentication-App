import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import tweetSlice from "./tweetSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    tweets: tweetSlice,
  },
});
