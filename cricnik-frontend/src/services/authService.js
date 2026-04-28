import { api } from "../api/api";

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");

    // remove token from localStorage
    localStorage.removeItem("token");

  } catch (error) {
    console.error("Logout error", error);
  }
};

// /auth/change-password

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await api.post("/auth/change-password", {
      oldPassword: currentPassword, // ✅ FIX HERE
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Change password error", error);
    throw error;
  }
};

// /auth/profile

export const getUserProfile = async () => {
  try {
    const response = await api.get("/auth/profile");
    return response.data;
  } catch (error) {
    console.error("Get profile error", error);
    throw error;
  }
};