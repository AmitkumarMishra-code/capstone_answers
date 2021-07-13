import firebase from '../../firebaseConfig'
import { IS_SUBMITTING, LOGOUT_USER, LOG_IN_SUCCESSFUL, LOG_IN_UNSUCCESSFUL, RESET_SESSION, RESET_STUDENTS, SET_SESSION, SUBMIT_ERROR, SUBMIT_SUCCESSFUL, USER_IS_LOGGING_IN } from './action_types';
var provider = new firebase.auth.GoogleAuthProvider();
const databaseRef = firebase.firestore()

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
        dispatch({
            type: RESET_SESSION
        })
        dispatch({
            type: RESET_STUDENTS
        })
        firebase.auth().signOut().then(() => {

            dispatch({
                type: LOGOUT_USER
            })

        }).catch((error) => {
            console.log(error.message)
        });
    }
}

export const setStudentsList = (list, email) => {
    return async(dispatch) => {
        list.sort()
        console.log(list)
        dispatch({
            type: IS_SUBMITTING
        })
        let teacherEmail = email.replaceAll('.', '_')
        let studentsObj = {}
        list.forEach(student => studentsObj[`${student}`] = '')
        console.log(studentsObj)
        try {
            let listId = await databaseRef.collection(teacherEmail).add(studentsObj)
                // console.log(listId.id)
            dispatch({
                type: SET_SESSION,
                payload: listId.id
            })
            dispatch({
                type: SUBMIT_SUCCESSFUL,
                payload: list
            })
        } catch (error) {
            dispatch({
                type: SUBMIT_ERROR,
                payload: error.message
            })
        }
    }
}