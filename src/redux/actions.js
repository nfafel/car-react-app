const LOGIN_USER = "LOGIN_USER";
const LOGOUT_USER = "LOGOUT_USER";
const SET_QUERY_TYPE = "SET_QUERY_TYPE"
const CHANGE_SUBSCRIPTION = "CHANGE_SUBSCRIPTION";

exports.loginUser = (payload) => {
    return { type: LOGIN_USER, payload }
}

exports.logoutUser = (payload) => {
    return { type: LOGOUT_USER, payload }
}

exports.setQueryType = (payload) => {
    return { type: SET_QUERY_TYPE, payload}
}

exports.changeSubscription = (payload) => {
    return { type: CHANGE_SUBSCRIPTION, payload}
}