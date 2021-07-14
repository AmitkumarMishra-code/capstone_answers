import firebase from '../../firebaseConfig'
import { BEGIN_END_SESSION, BEGIN_RETRIEVING_STUDENTS_LIST, END_SESSION_ERROR, END_SESSION_RESET, END_SESSION_SUCCESSFUL, IS_RETRIEVING_SESSION_INFO, IS_SUBMITTING, LOGOUT_USER, LOG_IN_SUCCESSFUL, LOG_IN_UNSUCCESSFUL, RESET_SESSION, RESET_STUDENTS, RETRIEVE_SESSION_INFORMATION_ERROR, RETRIEVE_SESSION_INFORMATION_SUCCESS, RETRIEVING_STUDENTS_LIST_ERROR, RETRIEVING_STUDENTS_LIST_SUCCESS, SET_SESSION, SUBMIT_ERROR, SUBMIT_SUCCESSFUL, USER_IS_LOGGING_IN } from './action_types';
var provider = new firebase.auth.GoogleAuthProvider();
const databaseRef = firebase.firestore()

export const startLogin = () => {
    return async(dispatch) => {
        dispatch({
            type: USER_IS_LOGGING_IN
        })
        firebase.auth()
            .signInWithPopup(provider)
            .then(async(result) => {
                var user = result.user;
                console.log(user)
                dispatch({
                    type: LOG_IN_SUCCESSFUL,
                    payload: user
                })
                await getUserSessionInformation(user.email, dispatch)
            }).catch((error) => {
                var errorMessage = error.message;
                dispatch({
                    type: LOG_IN_UNSUCCESSFUL,
                    payload: errorMessage
                })
            });
    }
}

export async function getUserSessionInformation(email, dispatch) {
    dispatch({
        type: IS_RETRIEVING_SESSION_INFO
    })
    let teacherEmail = email.replaceAll('.', '_')
    try {
        let currentSession = await databaseRef.collection('active_sessions').where('teacher', '==', email).get()

        console.log('printing user session info')
            // console.log(session.data())
        console.log(currentSession.size)

        dispatch({
            type: RETRIEVE_SESSION_INFORMATION_SUCCESS,
            payload: currentSession.size ? currentSession.docs[0].id : null
        })
        if (currentSession.size) {
            let session = await databaseRef.collection(teacherEmail).doc(currentSession.docs[0].data().currentSession).get()
            let studentsData = Object.keys(session.data()).sort()
            dispatch({
                type: SUBMIT_SUCCESSFUL,
                payload: studentsData
            })
        }
    } catch (error) {
        console.log(error.message)
        dispatch({
            type: RETRIEVE_SESSION_INFORMATION_ERROR,
            payload: error.message
        })
    }
}

export const logout = () => {
    return async(dispatch) => {
        resetSession(dispatch)
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
            let sessionId = await databaseRef.collection('active_sessions').add({ teacher: email, currentSession: listId.id })
            dispatch({
                type: SET_SESSION,
                payload: sessionId.id
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

export const endUserSession = (sessionId, email) => {
    return async(dispatch) => {
        // let teacherEmail = email.replaceAll('.', '_')
        dispatch({
            type: BEGIN_END_SESSION
        })
        try {
            // await databaseRef.collection(teacherEmail).doc(sessionId).delete()
            await databaseRef.collection('active_sessions').doc(sessionId).delete()
            dispatch({
                type: END_SESSION_SUCCESSFUL
            })
            resetSession(dispatch)
        } catch (error) {
            dispatch({
                type: END_SESSION_ERROR,
                payload: error.message
            })
        }
    }
}


function resetSession(dispatch) {
    dispatch({
        type: RESET_SESSION
    })
    dispatch({
        type: RESET_STUDENTS
    })
    dispatch({
        type: END_SESSION_RESET
    })
}

//Student Actions

export const retrieveStudentList = (sessionId) => {
    return async(dispatch) => {
        dispatch({
            type: BEGIN_RETRIEVING_STUDENTS_LIST
        })
        try {
            let currentSession = await databaseRef.collection('active_sessions').doc(sessionId).get()
            let teacherEmail = currentSession.data().teacher.replaceAll('.', '_')
            let currentSessionId = currentSession.data().currentSession
            let currentSessionDetails = await databaseRef.collection(teacherEmail).doc(currentSessionId).get()
            let studentsData = Object.keys(currentSessionDetails.data()).sort()
            console.log(studentsData)
            dispatch({
                type: RETRIEVING_STUDENTS_LIST_SUCCESS,
                payload: studentsData
            })
        } catch (error) {
            dispatch({
                type: RETRIEVING_STUDENTS_LIST_ERROR,
                payload: error.message
            })
        }
    }
}