import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import CssBaseline from '@material-ui/core/CssBaseline'
import { Provider } from 'react-redux';
import { store } from './redux/store';


ReactDOM.render(
    <Provider store = {store}>
    <React.Fragment>
        <CssBaseline/>
        <App / >
    </React.Fragment>
    </Provider>
 ,
    document.getElementById('root')
);
