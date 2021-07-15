import { RESET_ANONYMOUS_USER, RESET_STUDENT_NAME, SET_ANONYMOUS_USER, SET_STUDENT_NAME, SET_TEACHER_DETAILS } from "../actions/action_types";

export default function studentIdentityReducer(state = { name: "", user: undefined, teacher: null, currentSession: null }, action) {
    switch (action.type) {
        case SET_STUDENT_NAME:
            return {...state, name: action.payload }
        case RESET_STUDENT_NAME:
            return {...state, name: "" }
        case SET_ANONYMOUS_USER:
            return {...state, user: action.payload }
        case RESET_ANONYMOUS_USER:
            return {...state, user: undefined }
        case SET_TEACHER_DETAILS:
            return {...state, teacher: action.payload.teacher, currentSession: action.payload.currentSession }
        default:
            return state
    }
}