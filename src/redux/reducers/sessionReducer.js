import { RESET_SESSION, SET_SESSION } from "../actions/action_types";

export default function sessionReducer(state = null, action) {
    switch (action.type) {
        case RESET_SESSION:
            return null
        case SET_SESSION:
            return action.payload
        default:
            return state
    }
}