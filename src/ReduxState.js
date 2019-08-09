import { createStore } from "redux";

const LOGIN_USER = "LOGIN_USER"
const LOGOUT_USER = "LOGOUT_USER"

const initialState = {
    user: null
};

function loginUser(payload) {
    return { type: LOGIN_USER, payload }
}

function logoutUser(payload) {
    return { type: LOGOUT_USER, payload }
}

function rootReducer(state = initialState, action) {
    switch(action.type) {
        case LOGIN_USER:

        case LOGOUT_USER:
            
    }
};

const store = createStore(rootReducer);

export default store;