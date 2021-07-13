import { IS_SUBMITTING, RESET_STUDENTS, SUBMIT_ERROR, SUBMIT_SUCCESSFUL } from "../actions/action_types";

export default function studentListReducer(state = { isSubmitting: false, list: [], error: null }, action) {
    switch (action.type) {
        case IS_SUBMITTING:
            return {...state, isSubmitting: true }
        case SUBMIT_SUCCESSFUL:
            return {...state, list: action.payload, isSubmitting: false }
        case SUBMIT_ERROR:
            return {...state, error: action.payload, isSubmitting: false }
        case RESET_STUDENTS:
            return { isSubmitting: false, list: [], error: null }
        default:
            return state
    }
}