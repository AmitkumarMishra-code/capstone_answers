import firebase from '../../firebaseConfig'
import { ADD_LISTENER, BEGIN_CLEARING_ANSWERS, BEGIN_END_SESSION, BEGIN_RETRIEVING_STUDENTS_LIST, BEGIN_SYNCING_TEXT, CLEAR_ANSWERS_ERROR, CLEAR_ANSWERS_SUCCESS, END_SESSION_ERROR, END_SESSION_RESET, END_SESSION_SUCCESSFUL, IS_RETRIEVING_SESSION_INFO, IS_SUBMITTING, LOGOUT_USER, LOG_IN_SUCCESSFUL, LOG_IN_UNSUCCESSFUL, RESET_SESSION, RESET_STUDENTS, RETRIEVE_SESSION_INFORMATION_ERROR, RETRIEVE_SESSION_INFORMATION_SUCCESS, RETRIEVING_STUDENTS_LIST_ERROR, RETRIEVING_STUDENTS_LIST_SUCCESS, SET_SESSION, SET_TEACHER_DETAILS, STUDENT_SYNC_ERROR, STUDENT_SYNC_SUCCESS, SUBMIT_ERROR, SUBMIT_SUCCESSFUL, USER_IS_LOGGING_IN } from './action_types';
var provider = new firebase.auth.GoogleAuthProvider();
const databaseRef = firebase.firestore()

export const startLogin = () => {
    return async(dispatch) => {
        dispatch({
            type: USER_IS_LOGGING_IN
        })
        await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

        firebase.auth()
            .signInWithPopup(provider)
            .then(async(result) => {
                var user = result.user;
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
        dispatch({
            type: RETRIEVE_SESSION_INFORMATION_SUCCESS,
            payload: currentSession.size ? currentSession.docs[0].id : null
        })
        if (currentSession.size) {
            const unsubscribe = databaseRef.collection(teacherEmail).doc(currentSession.docs[0].data().currentSession)
                .onSnapshot((doc) => {
                    let updatedData = Object.entries(doc.data()).sort((a, b) => a[0].localeCompare(b[0]))
                    dispatch({
                        type: SUBMIT_SUCCESSFUL,
                        payload: updatedData
                    })
                });
            dispatch({
                type: ADD_LISTENER,
                payload: unsubscribe
            })
        }
    } catch (error) {
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
        dispatch({
            type: IS_SUBMITTING
        })
        let teacherEmail = email.replaceAll('.', '_')
        let studentsObj = {}
        list.forEach(student => studentsObj[`${student}`] = '')
        try {
            let listId = await databaseRef.collection(teacherEmail).add(studentsObj)
            let sessionId = await databaseRef.collection('active_sessions').add({ teacher: email, currentSession: listId.id })
            dispatch({
                type: SET_SESSION,
                payload: sessionId.id
            })
            await getUserSessionInformation(email, dispatch)
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
        dispatch({
            type: BEGIN_END_SESSION
        })
        try {
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
            dispatch({
                type: RETRIEVING_STUDENTS_LIST_SUCCESS,
                payload: studentsData
            })
            dispatch({
                type: SET_TEACHER_DETAILS,
                payload: {
                    teacher: teacherEmail,
                    currentSession: currentSessionId
                }
            })
        } catch (error) {
            dispatch({
                type: RETRIEVING_STUDENTS_LIST_ERROR,
                payload: error.message
            })
        }
    }
}


export const anonymousLogin = (sessionId) => {
    return async(dispatch) => {
        firebase.auth().signInAnonymously()
            .then(() => {
                dispatch(retrieveStudentList(sessionId))
            })
            .catch((error) => {
                console.log(error.message)
            });
    }
}


export const studentSync = (text, teacherEmail, currentSession, name) => {
    return async(dispatch) => {
        dispatch({
            type: BEGIN_SYNCING_TEXT
        })
        try {
            await databaseRef.collection(teacherEmail).doc(currentSession).update({
                [`${name}`]: text
            })
            dispatch({
                type: STUDENT_SYNC_SUCCESS
            })
        } catch (error) {
            dispatch({
                type: STUDENT_SYNC_ERROR,
                payload: error.message
            })
        }
    }
}

export const linkStudent = (answerRef, teacherEmail, currentSession, name) => {
    return async(dispatch) => {
        databaseRef.collection(teacherEmail).doc(currentSession)
            .onSnapshot((doc) => {
                let updatedData = Object.entries(doc.data())
                for (let data of updatedData) {
                    if (data[0] === name) {
                        answerRef.current.value = data[1]
                        break
                    }
                }
            });
    }
}

export const beginClearingAnswers = (email) => {
    return async(dispatch) => {
        let teacherEmail = email.replaceAll('.', '_')
        dispatch({
            type: BEGIN_CLEARING_ANSWERS
        })
        try {
            let currentSession = await databaseRef.collection('active_sessions').where('teacher', '==', email).get()
            if (currentSession.size) {
                let currentData = await databaseRef.collection(teacherEmail).doc(currentSession.docs[0].data().currentSession).get()
                let newData = {}
                for (let student in currentData.data()) {
                    newData[`${student}`] = ''
                }
                await databaseRef.collection(teacherEmail).doc(currentSession.docs[0].data().currentSession).set(newData)
                dispatch({
                    type: CLEAR_ANSWERS_SUCCESS
                })
            }
        } catch (error) {
            dispatch({
                type: CLEAR_ANSWERS_ERROR,
                payload: error.message
            })
        }
    }
}