import { call, put } from "redux-saga/effects";
import { createModule } from "saga-slice";
import SettingsServices from "../../services/SettingsServices ";

const SettingsSagaSlice = createModule({
    name: "settings",
    initialState: {
        loading: false,
        termsPolicyURI: "",
        privacyPolicyURI: "",
        error: {}
    },
    reducers: {
        fetchTermsPolicy: (state) => {
            state.loading = true;
        },
        fetchTermsPolicySuccess: (state, payload) => {
            state.loading = false;
            state.termsPolicyURI = payload;
        },
        fetchTermsPolicyFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchPrivacyPolicy: (state) => {
            state.loading = true;
        },
        fetchPrivacyPolicySuccess: (state, payload) => {
            state.loading = false;
            state.privacyPolicyURI = payload;
        },
        fetchPrivacyPolicyFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
    },
    sagas: (actions) => ({
        *[actions.fetchTermsPolicy]({ payload }) {
            try {
                const { resolve } = payload;
                const res = yield call(SettingsServices.fetchPolicy, 2);
                yield put(actions.fetchTermsPolicySuccess(res.data.data.doc_url));
                resolve(res.data.data.doc_url);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchTermsPolicyFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchPrivacyPolicy]({ payload }) {
            try {
                const { resolve } = payload;
                const res = yield call(SettingsServices.fetchPolicy, 1);
                yield put(actions.fetchPrivacyPolicySuccess(res.data.data.doc_url));
                resolve(res.data.data.doc_url);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchPrivacyPolicyFailure(err.response.data));
                reject(err.response.data);
            }
        },
    })
})

const { actions } = SettingsSagaSlice;
export const SettingsActions = actions;
export default SettingsSagaSlice;