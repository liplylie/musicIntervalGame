import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";
import logger from "redux-logger";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import propTypes from "prop-types";

import reducer from "./reducers/reducer";

const middleware = applyMiddleware(promise(), thunk, logger);

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer, middleware);

export default store;

export const persistor = persistStore(store);
