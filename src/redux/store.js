import { createStore } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER";
const SET_QUERY_TYPE = "SET_QUERY_TYPE";
const CHANGE_SUBSCRIPTION = "CHANGE_SUBSCRIPTION";

const initialState = {
    token: "",
    queryType: "rest",
    subscribed: null,
    phoneNumber: null
};

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN_USER:
            console.log("login_user", action.payload)

            return Object.assign({}, state, action.payload);

        case LOGOUT_USER:
            return Object.assign({}, state, {token: "", subscribed: null});

        case SET_QUERY_TYPE:
            return Object.assign({}, state, action.payload);

        case CHANGE_SUBSCRIPTION:
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

let store = createStore(persistedReducer)
export const persistor = persistStore(store);
export default store;