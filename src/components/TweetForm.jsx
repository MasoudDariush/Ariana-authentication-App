import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCurrentUser } from "../api/authApi";
import { addTweet, getAllTweets } from "../store/tweetSlice";

export default function TweetForm() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.tweets);
  const [text, setText] = useState("");
  const { tweets } = useSelector((state) => state.tweets);
  const user = useSelector((state) => state.auth.user);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() === "") return;

    dispatch(addTweet(text))
      .unwrap()
      .then(() => {
        dispatch(getAllTweets());
        setText("");
      })
      .catch(() => {});
  };

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE}${user.avatar}`
    : null;

  return (
    <div className="w-full p-4 flex items-center justify-center">
      <form onSubmit={handleSubmit} className=" w-8/12 p-4 bg-white   ">
        <div className="flex   justify-between border border-gray-200 rounded-lg p-4">
          <div className="bg-blue-100/50 rounded-full w-[40px] h-[40px]">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="text-black/25 text-2xl" />
            )}
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            maxLength={280}
            className="flex w-full items-start font-medium h-30 p-2 resize-none focus:outline-none focus:border-blue-500"
          />
          <div className="flex justify-end mt-20">
            <button
              type="submit"
              disabled={loading || text.trim() === ""}
              className="absolute px-6 py-2 bg-slate-800 text-sm text-white rounded-lg disabled:bg-gray-300 transition-all duration-300"
            >
              {loading ? "Sending..." : "Post"}
            </button>
          </div>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>
    </div>
  );
}
