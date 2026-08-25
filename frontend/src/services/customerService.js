import api from "../api/axios";

export const getCustomers = async () => {
  const response = await api.get("/customers/");

  return response.data;
};

export const searchCustomers = async (query) => {
  const response = await api.get("/customers/search/", {
    params: {
      q: query,
    },
  });

  return response.data;
};

export const getCustomerById = async (id) => {
  const response = await api.get(`/customers/${id}/`);

  return response.data;
};

export const updateCustomer = async (id, data) => {
  const response = await api.patch(`/customers/${id}/`, data);

  return response.data;
};

export const getCustomerPurchases = async (customerCode) => {
  const response = await api.get(`/purchases/customer/${customerCode}/`);

  return response.data;
};

export const getCustomerRewardHistory = async (customerCode) => {
  const response = await api.get(`/rewards/customer/${customerCode}/history/`);

  return response.data;
};

export const getMyCustomerProfile = async () => {
  const response = await api.get("/customers/me/");

  return response.data;
};
