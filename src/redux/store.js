import { createStore } from "redux";

const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER";
const SET_QUERY_TYPE = "SET_QUERY_TYPE";

const initialState = {
    user: null,
    queryType: "rest"
};

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN_USER:
            return Object.assign({}, state, action.payload);

        case LOGOUT_USER:
            return Object.assign({}, state, {user: null});

        case SET_QUERY_TYPE:
            return Object.assign({}, state, action.payload);

        default: 
            return state
    }
};

const store = createStore(rootReducer);

export default store;