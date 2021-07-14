import { RESET_STUDENT_NAME, SET_STUDENT_NAME } from "../actions/action_types";

export default function studentIdentityReducer(state = "", action) {
    switch (action.type) {
        case SET_STUDENT_NAME:
            return action.payload
        case RESET_STUDENT_NAME:
            return ""
        default:
            return state
    }
}