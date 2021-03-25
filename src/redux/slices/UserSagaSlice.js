import { call, put } from "redux-saga/effects";
import { createModule } from "saga-slice";
import SettingsServices from "../../services/SettingsServices ";
import UserServices from "../../services/UserServices";

const UserSagaSlice = createModule({
    name: "user",
    initialState: {
        loading: false,
        data: {},
        token: "",
        error: {}
    },
    reducers: {
        signupUser: (state) => {
            state.loading = true;
        },
        signupUserSuccess: (state, payload) => {
            state.loading = false;
            state.data = payload;
            state.token = payload.token;
        },
        signupUserFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        profileComplete: (state) => {
            state.loading = true;
        },
        profileCompleteSuccess: (state) => {
            state.loading = false;
        },
        profileCompleteFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        sendOTP: (state) => {
            state.loading = true;
        },
        sendOTPSuccess: (state) => {
            state.loading = false;
        },
        sendOTPFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        verifyOTP: (state) => {
            state.loading = true;
        },
        verifyOTPSuccess: (state) => {
            state.loading = false;
        },
        verifyOTPFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        loginUser: (state) => {
            state.loading = true;
        },
        loginUserSuccess: (state, payload) => {
            state.loading = false;
            state.data = payload;
            state.token = payload.token;
        },
        loginUserFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchUser: (state) => {
            state.loading = true;
        },
        fetchUserSuccess: (state, payload) => {
            state.loading = false;
            state.data = payload;
        },
        fetchUserFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        setToken: (state, payload) => {
            state.token = payload.token;
        },
        logoutUser: (state) => {
            state.loading = false;
            state.data = {};
            state.token = "";
            state.error = {};
        },
        sendEmailOTP: (state) => {
            state.loading = true;
        },
        sendEmailOTPSuccess: (state) => {
            state.loading = false;
        },
        sendEmailOTPFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        resetPassword: (state) => {
            state.loading = true;
        },
        resetPasswordSuccess: (state) => {
            state.loading = false;
        },
        resetPasswordFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        changePassword: (state) => {
            state.loading = true;
        },
        changePasswordSuccess: (state) => {
            state.loading = false;
        },
        changePasswordFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        notificationsToggle: (state) => {
            state.loading = true;
        },
        notificationsToggleSuccess: (state) => {
            state.loading = false;
        },
        notificationsToggleFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        editProfile: (state) => {
            state.loading = true;
        },
        editProfileSuccess: (state) => {
            state.loading = false;
        },
        editProfileFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
    },
    sagas: (actions) => ({
        *[actions.signupUser]({ payload }) {
            try {
                const { user, resolve } = payload;
                const res = yield call(UserServices.signup, user);
                yield put(actions.signupUserSuccess(res.data.data));
                resolve(res.data.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.signupUserFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.profileComplete]({ payload }) {
            try {
                const { user, token, resolve } = payload;
                const res = yield call(UserServices.profileComplete, user, token);
                yield put(actions.profileCompleteSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.profileCompleteFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.sendOTP]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(UserServices.sendOTP, token);
                yield put(actions.sendOTPSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.sendOTPFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.verifyOTP]({ payload }) {
            try {
                const { user, token, resolve } = payload;
                const res = yield call(UserServices.verifyOTP, user, token);
                yield put(actions.verifyOTPSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.verifyOTPFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.loginUser]({ payload }) {
            try {
                const { user, resolve } = payload;
                const res = yield call(UserServices.login, user);
                yield put(actions.loginUserSuccess(res.data.data));
                resolve(res.data.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.loginUserFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchUser]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(UserServices.fetchUserDetails, token);
                yield put(actions.fetchUserSuccess(res.data.data));
                resolve(res.data.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.fetchUserFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.sendEmailOTP]({ payload }) {
            try {
                const { user, resolve } = payload;
                const res = yield call(UserServices.sendEmailOTP, user);
                yield put(actions.sendEmailOTPSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.sendEmailOTPFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.resetPassword]({ payload }) {
            try {
                const { user, resolve } = payload;
                const res = yield call(UserServices.resetPassword, user);
                yield put(actions.resetPasswordSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.resetPasswordFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.changePassword]({ payload }) {
            try {
                const { user, resolve, token } = payload;
                const res = yield call(SettingsServices.changePassword, user, token);
                yield put(actions.changePasswordSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.changePasswordFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.notificationsToggle]({ payload }) {
            try {
                const { user, resolve, token } = payload;
                const res = yield call(SettingsServices.notificationsToggle, user, token);
                yield put(actions.notificationsToggleSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.notificationsToggleFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.editProfile]({ payload }) {
            try {
                const { user, token, resolve } = payload;
                const res = yield call(UserServices.editProfile, user, token);
                yield put(actions.editProfileSuccess());
                resolve(res.data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.editProfileFailure(err.response.data));
                reject(err.response.data);
            }
        },
    })
})

const { actions } = UserSagaSlice;
export const UserActions = actions;
export default UserSagaSlice;