import firebase from '../../firebaseConfig'
import { LOGOUT_USER, LOG_IN_SUCCESSFUL, LOG_IN_UNSUCCESSFUL, USER_IS_LOGGING_IN } from './action_types';
var provider = new firebase.auth.GoogleAuthProvider();

export const startLogin = () => {
    return async(dispatch) => {
        dispatch({
            type: USER_IS_LOGGING_IN
        })
        firebase.auth()
            .signInWithPopup(provider)
            .then((result) => {
                var user = result.user;
                console.log(user)
                dispatch({
                    type: LOG_IN_SUCCESSFUL,
                    payload: user
                })

            }).catch((error) => {
                var errorMessage = error.message;
                dispatch({
                    type: LOG_IN_UNSUCCESSFUL,
                    payload: errorMessage
                })
            });
    }
}

export const logout = () => {
    return async(dispatch) => {
        firebase.auth().signOut().then(() => {
            dispatch({
                type: LOGOUT_USER
            })
        }).catch((error) => {
            console.log(error.message)
        });
    }
}