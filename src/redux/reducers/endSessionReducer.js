import { BEGIN_END_SESSION, END_SESSION_ERROR, END_SESSION_RESET, END_SESSION_SUCCESSFUL } from "../actions/action_types";

export default function endSessionReducer(state = { isEndingSession: false, error: null }, action) {
    switch (action.type) {
        case BEGIN_END_SESSION:
            return {...state, isEndingSession: true }
        case END_SESSION_SUCCESSFUL:
            return {...state, isEndingSession: false }
        case END_SESSION_ERROR:
            return {...state, error: action.payload }
        case END_SESSION_RESET:
            return { isEndingSession: false, error: null }
        default:
            return state
    }
}