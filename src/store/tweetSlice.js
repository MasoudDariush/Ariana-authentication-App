import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTweets, createTweet, deleteTweet } from "../api/tweetApi";

const initialState = {
  tweets: [],
  loading: false,
  error: null,
};

export const getAllTweets = createAsyncThunk(
  "tweets/fetch",
  async (_, thunkAPI) => {
    try {
      return await fetchTweets();
    } catch (err) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const addTweet = createAsyncThunk(
  "tweets/create",
  async (text, thunkAPI) => {
    const tweet = await createTweet(text);
    const user = thunkAPI.getState().auth.user;

    if (!user) {
      throw new Error("User not found");
    }

    // 👇 ذخیره مالک توییت
    const map = JSON.parse(localStorage.getItem("tweetOwners")) || {};

    map[tweet.id] = user;

    localStorage.setItem("tweetOwners", JSON.stringify(map));

    return {
      ...tweet,
      user,
      createdAt: new Date().toISOString(),
    };
  }
);

export const removeTweet = createAsyncThunk(
  "tweets/delete",
  async (id, thunkAPI) => {
    await deleteTweet(id);

    // 👇 پاک کردن مالک توییت
    const owners = JSON.parse(localStorage.getItem("tweetOwners")) || {};

    delete owners[id];

    localStorage.setItem("tweetOwners", JSON.stringify(owners));

    return id;
  }
);

const tweetSlice = createSlice({
  name: "tweets",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTweets.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllTweets.fulfilled, (state, action) => {
        state.loading = false;

        const owners = JSON.parse(localStorage.getItem("tweetOwners")) || {};

        state.tweets = (action.payload.results || []).map((tweet) => {
          if (!tweet.user && owners[tweet.id]) {
            return {
              ...tweet,
              user: owners[tweet.id],
            };
          }
          return tweet;
        });
      })

      .addCase(getAllTweets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addTweet.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTweet.fulfilled, (state, action) => {
        state.loading = false;
        state.tweets.unshift(action.payload);
      })
      .addCase(addTweet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeTweet.fulfilled, (state, action) => {
        state.tweets = state.tweets.filter(
          (tweet) => tweet.id !== action.payload
        );
      });
  },
});

export default tweetSlice.reducer;
