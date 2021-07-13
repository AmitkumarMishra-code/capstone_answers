import { IS_RETRIEVING_SESSION_INFO, RESET_SESSION, RETRIEVE_SESSION_INFORMATION_ERROR, RETRIEVE_SESSION_INFORMATION_SUCCESS, SET_SESSION } from "../actions/action_types";

export default function sessionReducer(state = { isRetrieving: false, session: null, error: null }, action) {
    switch (action.type) {
        case RESET_SESSION:
            return { isRetrieving: false, session: null, error: null }
        case SET_SESSION:
            return {...state, session: action.payload }
        case IS_RETRIEVING_SESSION_INFO:
            return {...state, isRetrieving: true }
        case RETRIEVE_SESSION_INFORMATION_SUCCESS:
            return {...state, isRetrieving: false, session: action.payload }
        case RETRIEVE_SESSION_INFORMATION_ERROR:
            return {...state, error: action.payload }
        default:
            return state
    }
}