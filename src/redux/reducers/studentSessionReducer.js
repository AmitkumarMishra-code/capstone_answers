import { BEGIN_RETRIEVING_STUDENTS_LIST, RETRIEVING_STUDENTS_LIST_ERROR, RETRIEVING_STUDENTS_LIST_SUCCESS } from "../actions/action_types";

export default function studentSessionReducer(state = { isRetrieving: false, list: [], error: null }, action) {
    switch (action.type) {
        case BEGIN_RETRIEVING_STUDENTS_LIST:
            return {...state, isRetrieving: true }
        case RETRIEVING_STUDENTS_LIST_SUCCESS:
            return {...state, isRetrieving: false, list: action.payload }
        case RETRIEVING_STUDENTS_LIST_ERROR:
            return {...state, isRetrieving: false, error: action.payload }
        default:
            return state
    }
}