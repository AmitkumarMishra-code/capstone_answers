import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import endSessionReducer from "./reducers/endSessionReducer";
import sessionReducer from "./reducers/sessionReducer";
import studentIdentityReducer from "./reducers/studentIdentityReducer";
import studentListReducer from "./reducers/studentListReducer";
import studentSessionReducer from "./reducers/studentSessionReducer";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({
    user: userReducer,
    studentsList: studentListReducer,
    session: sessionReducer,
    endSession: endSessionReducer,
    studentSession: studentSessionReducer,
    studentName: studentIdentityReducer
})

export const store = createStore(rootReducer, applyMiddleware(thunk))