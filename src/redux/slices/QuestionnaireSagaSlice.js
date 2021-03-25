import { call, put } from "redux-saga/effects";
import { createModule } from "saga-slice";
import QuestionnaireServices from "../../services/QuestionnaireServices";

const QuestionnaireSagaSlice = createModule({
    name: "questionnaire",
    initialState: {
        loading: false,
        data: [],
        error: {}
    },
    reducers: {
        fetchQuestionnaire: (state) => {
            state.loading = true;
        },
        fetchQuestionnaireSuccess: (state, payload) => {
            state.loading = false;
            state.data = payload;
        },
        fetchQuestionnaireFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        submitAnswers: (state) => {
            state.loading = true;
        },
        submitAnswersSuccess: (state) => {
            state.loading = false;
        },
        submitAnswersFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        resetQuestionnaire: (state) => {
            state.loading = false;
            state.data = [];
            state.error = {};
        },
    },
    sagas: (actions) => ({
        *[actions.fetchQuestionnaire]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(QuestionnaireServices.fetchQuestionnaire, token);
                yield put(actions.fetchQuestionnaireSuccess(res.data.data));
                resolve(res.data.data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchQuestionnaireFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.submitAnswers]({ payload }) {
            try {
                const { answers, token, resolve } = payload;
                const res = yield call(QuestionnaireServices.submitAnswers, answers, token);
                yield put(actions.submitAnswersSuccess());
                resolve(res.data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.submitAnswersFailure(err.response.data));
                reject(err.response.data);
            }
        }
    })
})

const { actions } = QuestionnaireSagaSlice;
export const QuestionnaireActions = actions;
export default QuestionnaireSagaSlice;