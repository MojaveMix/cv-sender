import api from "./api";

export const fetchData = async (route) => {
  try {
    const { data } = await api.get(route);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const PostData = async (route, bodies, headers = {}) => {
  try {
    const { data } = await api.post(route, bodies, headers);
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const PutData = async (route, bodies) => {
  try {
    const { data } = await api.put(route, bodies);
    return data;
  } catch (error) {
    console.error(error);
  }
};
