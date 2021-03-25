import axios from "axios";
import { API_URL_3 } from "@env";

const CreditServices = {
    fetchCreditScore: (token) => {
        return axios.get(`${API_URL_3}credit-data/score`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    fetchCreditScoreHistory: (token) => {
        return axios.get(`${API_URL_3}credit-data/score/history`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    fetchCreditScoreFactor: (token) => {
        return axios.get(`${API_URL_3}credit-data/credit-factor`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    fetchCreditReports: (token) => {
        return axios.get(`${API_URL_3}credit-data/credit-reports`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    fetchCreditInfoContent: (token) => {
        return axios.get(`${API_URL_3}informational-data`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
}

export default CreditServices;