import { BEGIN_SYNCING_TEXT, STUDENT_SYNC_ERROR, STUDENT_SYNC_SUCCESS } from "../actions/action_types";

export default function studentSyncReducer(state = { isSyncing: false, error: null }, action) {
    switch (action.type) {
        case BEGIN_SYNCING_TEXT:
            return {...state, isSyncing: true }
        case STUDENT_SYNC_SUCCESS:
            return { isSyncing: false, error: null }
        case STUDENT_SYNC_ERROR:
            return { isSyncing: false, error: action.payload }
        default:
            return state
    }
}