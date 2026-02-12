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

export const getCurrentUserProfile = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/users/me`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateCurrentUserProfile = async (data) => {
  const res = await axios.put(`${API_BASE_URL}/api/users/me`, data, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const getMyBookings = async () => {
  const res = await axios.get(`${API_BASE_URL}/api/booking/my-bookings`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const cancelBooking = async (bookingId) => {
  const res = await axios.delete(`${API_BASE_URL}/api/booking/${bookingId}`, {
    headers: getAuthHeaders(),
  });
  return res.data;
};

export const updateBookingStatus = async (bookingId, newStatus) => {
  const res = await axios.patch(
    `${API_BASE_URL}/api/booking/${bookingId}/status`,
    JSON.stringify(newStatus),
    {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
      },
    }
  );
  return res.data;
};
