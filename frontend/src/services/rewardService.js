import api from "../api/axios";


export const getAvailableRewards = async (
  customerId
) => {
  const response = await api.get(
    `/rewards/customer/${customerId}/available/`
  );

  return response.data;
};