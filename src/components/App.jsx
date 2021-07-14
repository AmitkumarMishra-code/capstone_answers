import { useEffect } from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"
import Main from "./Main"
import NoMatch from "./NoMatch"
import Student from "./Student"
import Students from "./Students"
import firebase from '../firebaseConfig'
import { useDispatch, useSelector } from "react-redux"
import { getUserSessionInformation, logout } from "../redux/actions/actions"
import { SET_USER } from "../redux/actions/action_types"
import Login from "./Login"


export default function App() {
    return (
        <Router>
            <Switch>
                <PrivateRoute exact path='/'>
                    <Main />
                </PrivateRoute>
                <Route exact path='/login' component={Login} />
                <Route exact path='/404' component={NoMatch} />
                <Route exact path='/:id' component={Students} />
                <Route path='/:id/:name' component={Student} />
                <Route path="*">
                    <NoMatch />
                </Route>
            </Switch>
        </Router>
    )
}

function PrivateRoute({ children, ...rest }) {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    useEffect(() => {
        firebase.auth().onAuthStateChanged(async (user) => {
            console.log('in authstatechanged')
            if (user) {
                dispatch({
                    type: SET_USER,
                    payload: user
                })
                await getUserSessionInformation(user.email, dispatch)
            }
            else {
                dispatch(logout())
            }
        });
        // eslint-disable-next-line 
    }, [])

    return (
        <Route
            {...rest}
            render={({ location }) =>
                user.user !== null ? (
                    children
                ) : (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: location }
                        }}
                    />
                )
            }
        />
    );
}