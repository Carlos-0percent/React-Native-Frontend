import axios from "axios";
import { API_URL_1 } from "@env";

const UserServices = {
    signup: (body) => {
        return axios.post(`${API_URL_1}user/signup`, body);
    },
    profileComplete: (body, token) => {
        return axios.put(`${API_URL_1}user/profile/complete`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    sendOTP: (token) => {
        return axios.put(`${API_URL_1}user/otp/send`, {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    verifyOTP: (body, token) => {
        return axios.put(`${API_URL_1}user/otp/verify`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    login: (body) => {
        return axios.post(`${API_URL_1}user/login`, body);
    },
    fetchUserDetails: (token) => {
        return axios.get(`${API_URL_1}user/profile`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        });
    },
    sendEmailOTP: (body) => {
        return axios.put(`${API_URL_1}user/password/forgot`, body);
    },
    resetPassword: (body) => {
        return axios.put(`${API_URL_1}user/password/reset`, body);
    },
    editProfile: (body, token) => {
        return axios.put(`${API_URL_1}user/profile`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
}

export default UserServices;