import axios from '../utils/axios-customize';

export const callGetUsers = async (query: string) => {
  const response = await axios.get(
    `/api/v1/dashboard/user/get-all-users?${query}`
  );
  return response.data;
};

export const callAddUser = async (
  email: string,
  password: string,
  fullName: string,
  role: string
) => {
  return axios.post(`/api/v1/dashboard/user/add-user`, {
    email,
    password,
    fullName,
    role,
  });
};

export const callUpdateUser = async (
  email: string,
  role: string,
  status: string,
  fullName: string,
  id: string
) => {
  return axios.put(`/api/v1/dashboard/user/update-user`, {
    email,
    fullName,
    role,
    status,
    id,
  });
};
