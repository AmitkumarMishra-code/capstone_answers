import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import sessionReducer from "./reducers/sessionReducer";
import studentListReducer from "./reducers/studentListReducer";
import userReducer from "./reducers/userReducer";

const rootReducer = combineReducers({ user: userReducer, studentsList: studentListReducer, session: sessionReducer })

export const store = createStore(rootReducer, applyMiddleware(thunk))