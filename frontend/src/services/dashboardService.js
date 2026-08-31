import api from "../api/axios";


const buildDateParams = (fromDate, toDate) => ({
  from: fromDate,
  to: toDate,
});


export const getDashboardSummary = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    "/dashboard/summary/",
    {
      params: buildDateParams(
        fromDate,
        toDate
      ),
    }
  );

  return response.data;
};


export const getSalesTrend = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    "/dashboard/sales-trend/",
    {
      params: buildDateParams(
        fromDate,
        toDate
      ),
    }
  );

  return response.data;
};


export const getTopProducts = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    "/dashboard/top-products/",
    {
      params: buildDateParams(
        fromDate,
        toDate
      ),
    }
  );

  return response.data;
};


export const getTopCustomers = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    "/dashboard/top-customers/",
    {
      params: buildDateParams(
        fromDate,
        toDate
      ),
    }
  );

  return response.data;
};


export const getTopRewards = async (
  fromDate,
  toDate
) => {
  const response = await api.get(
    "/dashboard/top-rewards/",
    {
      params: buildDateParams(
        fromDate,
        toDate
      ),
    }
  );

  return response.data;
};