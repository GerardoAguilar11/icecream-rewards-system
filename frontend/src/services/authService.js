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

export const logout = async (refreshToken) => {
  const response = await api.post("/auth/logout/", {
    refresh: refreshToken,
  });

  return response.data;
};

export const register = async (data) => {
  const response = await api.post("/auth/register/", data);

  return response.data;
};
