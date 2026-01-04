import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { User, Trash2, MoreHorizontal } from "lucide-react";
import { removeTweet } from "../store/tweetSlice";

export default function TweetList() {
  const { tweets, loading, error } = useSelector((s) => s.tweets);
  const currentUser = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();

  if (loading) {
    return <p className="text-center py-4">Is Loading ...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (!tweets || tweets.length === 0) {
    return <p className="text-center py-4">The inbox is empty</p>;
  }

  // ⏱ time ago
  const timeAgo = (dateString) => {
    if (!dateString) return "Unknown time";

    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "just now";

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;

    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;

    const months = Math.floor(days / 30);
    if (months < 12) return `${months} month${months > 1 ? "s" : ""} ago`;

    const years = Math.floor(days / 365);
    return `${years} year${years > 1 ? "s" : ""} ago`;
  };

  return (
    <div className="flex flex-col items-center space-y-4 max-h-[calc(100vh-160px)] overflow-y-auto pb-6">
      {tweets.map((tweet, index) => {
        const user = tweet.user || null;

        // ✅ مالک واقعی پست
        const isOwner =
          currentUser?.username &&
          user?.username &&
          currentUser.username === user.username;

        return (
          <div
            key={tweet.id || index}
            className="w-7/11 bg-neutral-200/70 rounded-lg p-4 space-y-4"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                {user?.avatar ? (
                  <img
                    src={
                      user.avatar.startsWith("http")
                        ? user.avatar
                        : `https://mock.arianalabs.io${user.avatar}`
                    }
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="text-gray-500" />
                  </div>
                )}

                {/* Name & Time */}
                <div>
                  <p className="font-semibold">
                    {user
                      ? `${user.first_name || ""} ${user.last_name || ""}`
                      : "Unknown"}
                  </p>
                  <p
                    title={new Date(
                      tweet.createdAt || tweet.created_at
                    ).toLocaleString()}
                    className="text-sm text-gray-400"
                  >
                    {timeAgo(tweet.createdAt || tweet.created_at)}
                  </p>
                </div>
              </div>

              {/* ⋯ فقط برای صاحب پست */}
              {isOwner && <TweetMenu tweetId={tweet.id} />}
            </div>

            {/* Content */}
            <p className="text-gray-800">{tweet.text}</p>
          </div>
        );
      })}
    </div>
  );
}

function TweetMenu({ tweetId }) {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="p-1 rounded-full hover:bg-gray-300/40 transition"
      >
        <MoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute left-0  w-44 bg-white   rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              dispatch(removeTweet(tweetId));
              setOpen(false);
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-red-500 hover:bg-red-50 transition rounded-lg"
          >
            <Trash2 size={16} />
            <span className="font-medium">Delete Post</span>
          </button>
        </div>
      )}
    </div>
  );
}
