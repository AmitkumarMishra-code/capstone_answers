import { LOGOUT_USER, LOG_IN_SUCCESSFUL, LOG_IN_UNSUCCESSFUL, SET_USER, USER_IS_LOGGING_IN } from "../actions/action_types";

export default function userReducer(state = { isLoggingIn: false, user: null, error: null }, action) {
    switch (action.type) {
        case USER_IS_LOGGING_IN:
            return {...state, isLoggingIn: true }
        case LOG_IN_SUCCESSFUL:
            return {...state, isLoggingIn: false, user: action.payload }
        case LOG_IN_UNSUCCESSFUL:
            return {...state, isLoggingIn: false, error: action.payload }
        case LOGOUT_USER:
            return {...state, user: null, error: null }
        case SET_USER:
            return {...state, user: action.payload, error: null }
        default:
            return state
    }
}