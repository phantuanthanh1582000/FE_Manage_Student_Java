import createInstanceAxios from './axios.customer';

const axios = createInstanceAxios('http://localhost:8081')

export const login = (props) => {
    const urlBackend = "/api/auth/login";
    return axios.post(urlBackend, props);
};

export const getAllDepartment = () => {
    const urlBackend = "/api/departments";
    return axios.get(urlBackend);
};

export const getMajorById = (id) => {
  return axios.get(`/api/majors/${id}`);
};