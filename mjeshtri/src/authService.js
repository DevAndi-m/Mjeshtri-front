import axios from "axios";
import API_BASE_URL from "./api";

export const register = async (data) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/auth/register`,
    data
  );
  return res.data;
};

export const login = async (data) => {
  const res = await axios.post(
    `${API_BASE_URL}/api/auth/login`,
    data
  );
  return res.data;
};
