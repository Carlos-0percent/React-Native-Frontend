import axios from "axios";
import { API_URL_4 } from "@env";

const SettingsServices = {
    changePassword: (body, token) => {
        return axios.put(`${API_URL_4}user/settings/password`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    notificationsToggle: (body, token) => {
        return axios.put(`${API_URL_4}user/settings/notification`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },
    fetchPolicy: (type, token) => {
        return axios.get(`${API_URL_4}user/settings/document/${type}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Cache-Control": "no-store"
            }
        })
    },
}

export default SettingsServices;