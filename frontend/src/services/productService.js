import api from "../api/axios";


export const getProducts = async () => {
  const response = await api.get(
    "/products/"
  );

  return response.data;
};


export const getProductById = async (id) => {
  const response = await api.get(
    `/products/${id}/`
  );

  return response.data;
};


export const createProduct = async (data) => {
  const response = await api.post(
    "/products/",
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const updateProduct = async (
  id,
  data
) => {
  const response = await api.patch(
    `/products/${id}/`,
    data,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};


export const deleteProduct = async (id) => {
  await api.delete(
    `/products/${id}/`
  );
};