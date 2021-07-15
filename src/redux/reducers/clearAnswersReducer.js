import { BEGIN_CLEARING_ANSWERS, CLEAR_ANSWERS_ERROR, CLEAR_ANSWERS_SUCCESS } from "../actions/action_types";

export default function clearAnswersReducer(state = { isClearing: false, error: null }, action) {
    switch (action.type) {
        case BEGIN_CLEARING_ANSWERS:
            return {...state, isClearing: true }
        case CLEAR_ANSWERS_SUCCESS:
            return { isClearing: false, error: null }
        case CLEAR_ANSWERS_ERROR:
            return { isClearing: false, error: action.payload }
        default:
            return state
    }
}