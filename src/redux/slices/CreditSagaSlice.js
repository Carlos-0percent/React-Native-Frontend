import { call, put } from "redux-saga/effects";
import { createModule } from "saga-slice";
import { CreditScoreLevel, Month } from "../../constants/Constants";
import CreditServices from "../../services/CreditServices";

const CreditSagaSlice = createModule({
    name: "credit",
    initialState: {
        loading: false,
        data: {},
        history: [],
        factor: [],
        reports: [],
        info: {},
        error: {}
    },
    reducers: {
        fetchCreditScore: (state) => {
            state.loading = true;
        },
        fetchCreditScoreSuccess: (state, payload) => {
            state.loading = false;
            state.data = payload;
        },
        fetchCreditScoreFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchCreditScoreHistory: (state) => {
            state.loading = true;
        },
        fetchCreditScoreHistorySuccess: (state, payload) => {
            state.loading = false;
            state.history = payload;
        },
        fetchCreditScoreHistoryFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchCreditScoreFactor: (state) => {
            state.loading = true;
        },
        fetchCreditScoreFactorSuccess: (state, payload) => {
            state.loading = false;
            state.factor = payload;
        },
        fetchCreditScoreFactorFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchCreditReports: (state) => {
            state.loading = true;
        },
        fetchCreditReportsSuccess: (state, payload) => {
            state.loading = false;
            state.reports = payload;
        },
        fetchCreditReportsFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchCreditInfoContent: (state) => {
            state.loading = true;
        },
        fetchCreditInfoContentSuccess: (state, payload) => {
            state.loading = false;
            state.info = payload;
        },
        fetchCreditInfoContentFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
    },
    sagas: (actions) => ({
        *[actions.fetchCreditScore]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(CreditServices.fetchCreditScore, token);
                const creditScore = res.data.data.providerViews[0].score;
                let creditScoreType = "";
                if (creditScore <= CreditScoreLevel[0].maxScore) {
                    creditScoreType = CreditScoreLevel[0].type;
                } else if (creditScore <= CreditScoreLevel[1].maxScore) {
                    creditScoreType = CreditScoreLevel[1].type;
                } else if (creditScore <= CreditScoreLevel[2].maxScore) {
                    creditScoreType = CreditScoreLevel[2].type;
                } else if (creditScore <= CreditScoreLevel[3].maxScore) {
                    creditScoreType = CreditScoreLevel[3].type;
                } else if (creditScore <= CreditScoreLevel[4].maxScore) {
                    creditScoreType = CreditScoreLevel[4].type;
                }
                const data = {
                    score: creditScore,
                    type: creditScoreType
                }
                yield put(actions.fetchCreditScoreSuccess(data));
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchCreditScoreFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchCreditScoreHistory]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(CreditServices.fetchCreditScoreHistory, token);
                const actualRes = res.data.data;
                const data = [
                    { month: Month[new Date(actualRes[3].generatedDate).getMonth()].key, score: actualRes[3].providerViews[0].score, year: new Date(actualRes[3].generatedDate).getFullYear() },
                    { month: Month[new Date(actualRes[2].generatedDate).getMonth()].key, score: actualRes[2].providerViews[0].score, year: new Date(actualRes[2].generatedDate).getFullYear() },
                    { month: Month[new Date(actualRes[1].generatedDate).getMonth()].key, score: actualRes[1].providerViews[0].score, year: new Date(actualRes[1].generatedDate).getFullYear() },
                    { month: Month[new Date(actualRes[0].generatedDate).getMonth()].key, score: actualRes[0].providerViews[0].score, year: new Date(actualRes[0].generatedDate).getFullYear() },
                ];
                yield put(actions.fetchCreditScoreHistorySuccess(data));
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchCreditScoreHistoryFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchCreditScoreFactor]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(CreditServices.fetchCreditScoreFactor, token);
                yield put(actions.fetchCreditScoreFactorSuccess(res.data.data));
                resolve(res.data.data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchCreditScoreFactorFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchCreditReports]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(CreditServices.fetchCreditReports, token);
                yield put(actions.fetchCreditReportsSuccess(res.data.data));
                resolve(res.data.data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchCreditReportsFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchCreditInfoContent]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(CreditServices.fetchCreditInfoContent, token);
                const actualRes = res.data.data;
                const data = {
                    content: actualRes["informational_content"],
                    video: actualRes["informational_video"]
                }
                yield put(actions.fetchCreditInfoContentSuccess(data));
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchCreditInfoContentFailure(err.response.data));
                reject(err.response.data);
            }
        },
    })
})

const { actions } = CreditSagaSlice;
export const CreditActions = actions;
export default CreditSagaSlice;