import api from "../api/axios";


export const getRewards = async () => {
  const response = await api.get(
    "/rewards/"
  );

  return response.data;
};


export const getRewardById = async (
  id
) => {
  const response = await api.get(
    `/rewards/${id}/`
  );

  return response.data;
};


export const createReward = async (
  data
) => {
  const response = await api.post(
    "/rewards/",
    data
  );

  return response.data;
};


export const updateReward = async (
  id,
  data
) => {
  const response = await api.patch(
    `/rewards/${id}/`,
    data
  );

  return response.data;
};


export const getAvailableRewards = async (
  customerId
) => {
  const response = await api.get(
    `/rewards/customer/${customerId}/available/`
  );

  return response.data;
};


export const getCustomerRewardHistory = async (
  customerCode
) => {
  const response = await api.get(
    `/rewards/customer/${customerCode}/history/`
  );

  return response.data;
};

export const getMyRewardCatalog = async () => {
  const response = await api.get(
    "/rewards/customer/me/catalog/"
  );

  return response.data;
};