import axios from "axios";
import { API_URL_5 } from "@env";

const SubscriptionsServices = {
    fetchPlans: (token) => {
        return axios.get(`${API_URL_5}subscription/plans`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        })
    },
    createSessionId: (body, token) => {
        return axios.post(`${API_URL_5}subscription/buy`, body, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },
    fetchMyPlan: (token) => {
        return axios.get(`${API_URL_5}subscription`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        })
    },
    fetchMyPaymentHistory: (token) => {
        return axios.get(`${API_URL_5}subscription/paymentHistory`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        })
    },
    cancelPlan: (token) => {
        return axios.put(`${API_URL_5}subscription/cancel`, {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        })
    },
}

export default SubscriptionsServices;