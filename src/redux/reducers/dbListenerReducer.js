import { ADD_LISTENER } from "../actions/action_types";

export default function dbListenerReducer(state = null, action) {
    switch (action.type) {
        case ADD_LISTENER:
            return action.payload
        default:
            return state
    }
}