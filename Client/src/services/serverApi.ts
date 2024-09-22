import axios from '../utils/axios-customize';

export const callGetUsers = async (query: string) => {
  return await axios.get(`/api/v1/dashboard/user/get-all-users?${query}`);
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

export const callDeleteUser = async (id: string) => {
  return axios.delete(`/api/v1/dashboard/user/delete-user/${id}`);
};

export const callGetUserById = async (id: string) => {
  return axios.get(`/api/v1/dashboard/user/get-user/${id}`);
};

export const callAddNewEmployee = async (employeeName: string, email: string, salary: string, jobTitle: string) => {
  return axios.post(`/api/v1/dashboard/user/add-new-employee`, {
    employeeName,
    email,
    salary,
    jobTitle,
  });
};

export const callGetAllEmployee = async (query: string) => {
  return axios.get(`/api/v1/dashboard/employee/get-all-employees?${query}`);
};

export const callDeleteEmployee = async (employeeId: string) => {
  return axios.delete(`/api/v1/dashboard/employee/delete-employee/${employeeId}`);
};

export const callUpdateEmployee = async (employeeId: string, employeeName: string, email: string, salary: string, jobTitle: string) => {
  return axios.put(`/api/v1/dashboard/employee/update-employee`, {
    employeeId,
    employeeName,
    email,
    salary,
    jobTitle,
  });
};