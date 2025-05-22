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

export const addDepartment = (props) => {
    const urlBackend = "/api/departments";
    return axios.post(urlBackend, props);
};

export const updateDepartment = (id, props) => {
  const urlBackend = `/api/departments/${id}`;
  return axios.put(urlBackend, props);
};

export const deleteDepartment = (id) => {
  return axios.delete(`/api/departments/${id}`);
};

export const addMajor = (id, props) => {
  const urlBackend = `/api/majors/departments/${id}`;
  return axios.post(urlBackend, props);
};

export const updateMajor = (id, props) => {
  const urlBackend = `/api/majors/${id}`;
  return axios.put(urlBackend, props);
};

export const getAllMajors = () => {
  const urlBackend = `/api/majors`;
  return axios.get(urlBackend);
};

export const getClassById = (id) => {
  return axios.get(`/api/classes/${id}`);
};

export const addClass = (id, props) => {
  const urlBackend = `/api/classes/majors/${id}`;
  return axios.post(urlBackend, props);
};

export const updateClass = (classId, majorId, props) => {
  const urlBackend = `/api/classes/${classId}/majors/${majorId}`;
  return axios.put(urlBackend, props);
};

export const deleteMajor = (majorId) => {
  return axios.delete(`/api/majors/${majorId}`);
};