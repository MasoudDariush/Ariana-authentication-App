import axios from "axios";

const API = "https://mock.arianalabs.io/api";

export const fetchTweets = async () => {
  const res = await axios.get(`${API}/tweet/`);
  return res.data;
};

export const createTweet = async (text) => {
  const res = await axios.post(`${API}/tweet/`, { text });
  return res.data;
};

export const deleteTweet = async (id) => {
  await axios.delete(`${API}/tweet/${id}/`);
  return id;
};
