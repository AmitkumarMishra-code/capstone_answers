import { RESET_QUESTION, SET_QUESTION } from "../actions/action_types";

export default function questionReducer(state = '', action) {
    switch (action.type) {
        case SET_QUESTION:
            return action.payload
        case RESET_QUESTION:
            return ''
        default:
            return state
    }
}