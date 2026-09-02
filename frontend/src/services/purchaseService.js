import api from "../api/axios";


export const getPurchases = async (
  filters = {}
) => {
  const params = {};

  if (filters.dateFrom) {
    params.date_from =
      filters.dateFrom;
  }

  if (filters.dateTo) {
    params.date_to =
      filters.dateTo;
  }


  const response = await api.get(
    "/purchases/",
    {
      params,
    }
  );


  return response.data;
};


export const getPurchaseById = async (
  id
) => {
  const response = await api.get(
    `/purchases/${id}/`
  );

  return response.data;
};


export const createPurchase = async (
  data
) => {
  const response = await api.post(
    "/purchases/",
    data
  );

  return response.data;
};


export const cancelPurchase = async (
  id
) => {
  const response = await api.patch(
    `/purchases/${id}/cancel/`
  );

  return response.data;
};


export const getMyPurchases = async () => {
  const response = await api.get(
    "/purchases/me/"
  );

  return response.data;
};


export const getMyPurchaseById = async (
  id
) => {
  const response = await api.get(
    `/purchases/me/${id}/`
  );

  return response.data;
};