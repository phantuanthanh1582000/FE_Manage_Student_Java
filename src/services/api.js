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
export const getAllSubjects = () => {
  const urlBackend = `/api/subjects`;
  return axios.get(urlBackend);
};

export const addSubject = (id, props) => {
  const urlBackend = `/api/subjects/majors/${id}`;
  return axios.post(urlBackend, props);
};

export const getAllRoom = () => {
  const urlBackend = `/api/rooms`;
  return axios.get(urlBackend);
};

export const getAllTeacher = () => {
  const urlBackend = `/api/users/teachers`;
  return axios.get(urlBackend);
};

export const addRoom = (props) => {
  const urlBackend = `/api/rooms`;
  return axios.post(urlBackend, props);
};

export const getAllSchedule = () => {
  const urlBackend = `/api/schedules`;
  return axios.get(urlBackend);
};

export const getAllClasses = () => {
  const urlBackend = `/api/classes`;
  return axios.get(urlBackend);
};

export const getSubjectById = (id) => {
  return axios.get(`/api/subjects/${id}`);
};

export const getUserById = (id) => {
  return axios.get(`/api/users/${id}`);
};

export const getRoomById = (id) => {
  return axios.get(`/api/rooms/${id}`);
};

export const addSchedule = (props) => {
  const urlBackend = `/api/schedules`;
  return axios.post(urlBackend, props);
};

export const getLessons = (props) => {
  const urlBackend = `/api/lessons`;
  return axios.get(urlBackend, props);
};

export const getAttendance= (id) => {
  return axios.get(`/api/attendance/attendance-list/${id}`);
};

export const addLessons = (props) => {
  const urlBackend = `/api/lessons/generate`;
  return axios.post(urlBackend, props);
};

export const addAttendance = (id) => {
  return axios.post(`/api/attendance/generate-by-schedule/${id}`);
};

export const getLessonByDate = (date) => {
  const urlBackend = `/api/lessons/by-date?date=${date}`;
  return axios.get(urlBackend);
}

export const getAttendanceStudent = (lessonId) => {
  const urlBackend = `/api/attendance/attendance-list/${lessonId}`;
  return axios.get(urlBackend);
}

export const updateStatusAttendance = (props) => {
  const urlBackend = `/api/attendance/update-status`;
  return axios.post(urlBackend, props);
}


