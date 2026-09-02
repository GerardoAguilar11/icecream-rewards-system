import api from "../api/axios";


export const getPointsSettings =
  async () => {
    const response =
      await api.get(
        "/settings/points/",
      );

    return response.data;
  };


export const updatePointsSettings =
  async (data) => {
    const response =
      await api.patch(
        "/settings/points/",
        data,
      );

    return response.data;
  };