import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Main from "./Main"
import NoMatch from "./NoMatch"
import Student from "./Student"
import Students from "./Students"
export default function App() {
    return (
        <Router>
            <Switch>
                <Route exact path='/'>
                    <Main />
                </Route>
                <Route exact path = '/404' component = {NoMatch}/>
                <Route exact path='/:id' component={Students} />
                <Route path='/:id/:name' component={Student} />
                <Route path="*">
                    <NoMatch />
                </Route>
            </Switch>
        </Router>
    )
}