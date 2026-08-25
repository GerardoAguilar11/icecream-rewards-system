import api from "../api/axios";

export const login = async (email, password) => {
  const response = await api.post("/auth/login/", {
    email,
    password,
  });

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me/");

  return response.data;
};

export const logout = async (refresh) => {
  const response = await api.post("/auth/logout/", {
    refresh,
  });

  return response.data;
};
