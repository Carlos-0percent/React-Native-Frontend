import { applyMiddleware, createStore } from "redux";
import createSagaMiddleware from "redux-saga";
import { rootReducer, rootSaga } from "saga-slice";
import CreditSagaSlice from "./slices/CreditSagaSlice";
import QuestionnaireSagaSlice from "./slices/QuestionnaireSagaSlice";
import SettingsSagaSlice from "./slices/SettingsSagaSlice";
import SubscriptionsSagaSlice from "./slices/SubscriptionsSagaSlice";
import UserSagaSlice from "./slices/UserSagaSlice";

const modules = [
    UserSagaSlice,
    QuestionnaireSagaSlice,
    CreditSagaSlice,
    SettingsSagaSlice,
    SubscriptionsSagaSlice
];

const sagaMiddleware = createSagaMiddleware();

const appReducer = rootReducer(modules);

const middleware = applyMiddleware(...[sagaMiddleware]);

const store = createStore(appReducer, middleware);

sagaMiddleware.run(rootSaga(modules));

export default store;