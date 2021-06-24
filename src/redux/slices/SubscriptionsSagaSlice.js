import { call, put } from "redux-saga/effects";
import { createModule } from "saga-slice";
import _ from "lodash";
import SubscriptionsServices from "../../services/SubscriptionsServices";
import { Month } from "../../constants/Constants";

const SubscriptionsSagaSlice = createModule({
    name: "subscriptions",
    initialState: {
        loading: false,
        plans: [],
        error: {},
        myPlan: {},
        sessionId: "",
        history: []
    },
    reducers: {
        fetchPlans: (state) => {
            state.loading = true;
        },
        fetchPlansSuccess: (state, payload) => {
            state.loading = false;
            state.plans = payload;
        },
        fetchPlansFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        purchasePlanStart: (state) => {
            state.loading = true;
        },
        purchasePlanStartSuccess: (state, payload) => {
            state.loading = false;
            state.sessionId = payload;
        },
        purchasePlanStartFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchMyPlan: (state) => {
            state.loading = true;
        },
        fetchMyPlanSuccess: (state, payload) => {
            state.loading = false;
            state.myPlan = payload;
        },
        fetchMyPlanFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        fetchMyPaymentHistory: (state) => {
            state.loading = true;
        },
        fetchMyPaymentHistorySuccess: (state, payload) => {
            state.loading = false;
            state.history = payload;
        },
        fetchMyPaymentHistoryFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
        cancelPlan: (state) => {
            state.loading = true;
        },
        cancelPlanSuccess: (state) => {
            state.loading = false;
        },
        cancelPlanFailure: (state, payload) => {
            state.loading = false;
            state.error = payload;
        },
    },
    sagas: (actions) => ({
        *[actions.fetchPlans]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(SubscriptionsServices.fetchPlans, token);
                const plans = _.map(res.data.data);
                const data = _.map(plans, (plan) => {
                    let description = [];
                    if (_.isString(plan.description)) {
                        description.push(plan.description);
                    } else {
                        description = _.map(plan.description);
                    }
                    return ({
                        id: plan.id,
                        cost: plan.cost,
                        name: plan.name,
                        type: _.split(plan.name, "-")[2] === "Annually" ? "platinum" : "gold",
                        description
                    });
                })
                yield put(actions.fetchPlansSuccess(data));
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchPlansFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.purchasePlanStart]({ payload }) {
            try {
                const { plan, token, resolve } = payload;
                const res = yield call(SubscriptionsServices.createSessionId, plan, token);
                const data = res.data.data;
                yield put(actions.purchasePlanStartSuccess(data.id));
                resolve(data);
            }
            catch (err) {
                const { reject } = payload;
                yield put(actions.purchasePlanStartFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchMyPlan]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(SubscriptionsServices.fetchMyPlan, token);
                let plan = res.data.data[0];
                let description = [];
                if (_.isString(plan.sub_plan_desc)) {
                    description.push(plan.sub_plan_desc);
                } else {
                    description = _.map(plan.sub_plan_desc);
                }
                plan = {
                    id: plan.sub_plan_id,
                    cost: plan.sub_plan_cost,
                    name: plan.sub_plan_name,
                    type: _.split(plan.sub_plan_name, "-")[2] === "Annually" ? "platinum" : "gold",
                    description,
                    purchaseId: plan.id
                }
                const data = plan;
                yield put(actions.fetchMyPlanSuccess(data));
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchMyPlanFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.fetchMyPaymentHistory]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(SubscriptionsServices.fetchMyPaymentHistory, token);
                const data = res.data.data;
                const payHistory = _.map(data.paymentsList, (pay) => {
                    const date = new Date(_.toNumber(pay.subscription_start_date));
                    return ({
                        date: `${date.getDate()} ${Month[date.getMonth()].key}`,
                        description: pay.subscription_plan_name,
                        cost: pay.amount
                    });
                })
                yield put(actions.fetchMyPaymentHistorySuccess(payHistory));
                resolve(payHistory);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.fetchMyPaymentHistoryFailure(err.response.data));
                reject(err.response.data);
            }
        },
        *[actions.cancelPlan]({ payload }) {
            try {
                const { token, resolve } = payload;
                const res = yield call(SubscriptionsServices.cancelPlan, token);
                const data = res.data;
                yield put(actions.cancelPlanSuccess());
                resolve(data);
            } catch (err) {
                const { reject } = payload;
                yield put(actions.cancelPlanFailure(err.response.data));
                reject(err.response.data);
            }
        },
    })
})

const { actions } = SubscriptionsSagaSlice;
export const SubscriptionsActions = actions;
export default SubscriptionsSagaSlice;