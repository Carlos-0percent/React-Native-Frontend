import axios from "axios";
import { API_URL_2 } from "@env";

const QuestionnaireServices = {
    fetchQuestionnaire: (token) => {
        return axios.get(`${API_URL_2}questionare`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    },
    submitAnswers: (body, token) => {
        return axios.post(`${API_URL_2}questionare/answers`, body, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    }
}

export default QuestionnaireServices;