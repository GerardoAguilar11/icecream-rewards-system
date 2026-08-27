import api from "../api/axios";


export const getEmployees = async () => {
  const response = await api.get(
    "/auth/employees/"
  );

  return response.data;
};


export const getEmployeeById = async (
  id
) => {
  const response = await api.get(
    `/auth/employees/${id}/`
  );

  return response.data;
};


export const createEmployee = async (
  data
) => {
  const response = await api.post(
    "/auth/employees/",
    data
  );

  return response.data;
};


export const updateEmployee = async (
  id,
  data
) => {
  const response = await api.patch(
    `/auth/employees/${id}/`,
    data
  );

  return response.data;
};