import api from "../api/axios";

export const getDashboardSummary = async () => {
  const response = await api.get("/dashboard/summary/");

  return response.data;
};

export const getTopProducts = async () => {
  const response = await api.get("/dashboard/top-products/");

  return response.data;
};

export const getSalesLast7Days = async () => {
  const response = await api.get("/dashboard/sales-last-7-days/");

  return response.data;
};
