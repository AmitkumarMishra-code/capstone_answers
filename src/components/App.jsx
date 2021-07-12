import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Main from "./Main"
export default function App(){
    return (
        <Router>
            <Switch>
                <Route exact path = '/'>
                    <Main />
                </Route>
            </Switch>
        </Router>
    )
}