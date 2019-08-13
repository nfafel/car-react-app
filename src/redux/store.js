import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER";
const SET_QUERY_TYPE = "SET_QUERY_TYPE";

const initialState = {
    token: null,
    queryType: "rest"
};

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN_USER:
            return Object.assign({}, state, action.payload);

        case LOGOUT_USER:
            return Object.assign({}, state, {token: null});

        case SET_QUERY_TYPE:
            return Object.assign({}, state, action.payload);

        default: 
            return state
    }
};

const persistConfig = {
    key: 'root',
    storage,
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export default () => {
    let store = createStore(persistedReducer)
    let persistor = persistStore(store)
    return { store, persistor }
}