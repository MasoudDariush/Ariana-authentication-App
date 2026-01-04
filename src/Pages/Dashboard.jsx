import React, { useEffect, useState } from "react";
import { User, LogOut, TvMinimalPlay, X, ShieldAlert } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logout, setUser } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/authApi";
import { getAllTweets } from "../store/tweetSlice";
import TweetForm from "../components/TweetForm";
import TweetList from "../components/TweetList";

const API_BASE = "https://mock.arianalabs.io";

export default function Dashboard() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResponse = await getCurrentUser();
        dispatch(setUser(userResponse[0] || userResponse));
      } catch (error) {
        console.error("Fetch user error:", error);
        dispatch(logout());
        navigate("/");
      }
    };

    if (!user) {
      fetchUser();
    }

    dispatch(getAllTweets());
  }, [user, dispatch, navigate]);

  const confirmLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const avatarUrl = user?.avatar
    ? user.avatar.startsWith("http")
      ? user.avatar
      : `${API_BASE}${user.avatar}`
    : null;

  return (
    <>
      <div className="flex w-full min-h-screen">
        {/* Side bar */}
        <div className="flex justify-center w-[250px] bg-slate-200/30 border-r border-slate-300/30 py-4 px-2">
          <div className="flex flex-col items-center justify-between w-full">
            <div className="flex flex-col items-center">
              <div className="bg-blue-100/50 rounded-full w-[50px] h-[50px]">
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
              <p>
                {user?.first_name} {user?.last_name}
              </p>
              <p>{user?.username}</p>
            </div>

            {/* Logout button */}
            <div
              className="flex items-center justify-center space-x-2 w-full bg-red-600 rounded-md text-white py-1 text-sm font-mono cursor-pointer"
              onClick={() => setShowLogoutModal(true)}
            >
              <LogOut className="w-4" /> <span>Logout</span>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex flex-col w-full h-screen">
          {/* Form */}
          <div className="shrink-0">
            <TweetForm />
          </div>

          {/* Scrollable Tweets */}
          <div className="flex-1 overflow-y-auto">
            <TweetList />
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex justify-center items-center z-50 animate-fade">
          <div className="bg-white w-[380px] rounded-xl shadow-xl p-6 relative animate-scale">
            {/* Close (X) */}
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-black"
              onClick={() => setShowLogoutModal(false)}
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-2">
              <div className="flex items-center justify-center text-2xl">
                <ShieldAlert size={44} />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-md font-semibold text-center mb-2">Log out</h2>

            {/* Description */}
            <p className="text-center text-gray-600 text-sm mb-8">
              Are you sure you want to sign out of your account?
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={confirmLogout}
                className="flex-1 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
              >
                Log out
              </button>

              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-2 text-sm rounded-lg bg-black text-white transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
