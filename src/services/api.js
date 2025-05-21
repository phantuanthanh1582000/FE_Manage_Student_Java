import createInstanceAxios from './axios.customer';

const axios = createInstanceAxios('http://localhost:8081')

export const login = (props) => {
    const urlBackend = "/api/auth/login";
    return axios.post(urlBackend, props);
};