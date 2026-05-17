import axios from "axios";
import API_BASE_URL from "./api";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

export const createTeam = async (teamData) => {
  const res = await axios.post(`${API_BASE_URL}/api/test/post-team`, teamData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const createPlayer = async (playerData) => {
  const res = await axios.post(`${API_BASE_URL}/api/test/post-player`, playerData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getPlayers = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/test/players`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const deletePlayer = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/api/test/delete-player?id=${id}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updatePlayer = async (playerData) => {
  const res = await axios.put(`${API_BASE_URL}/api/test/update-player`, playerData, {
    headers: getAuthHeaders(),
  });
  return res.data;
};