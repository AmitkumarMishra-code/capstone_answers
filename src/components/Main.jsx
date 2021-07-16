import { Button, Typography, makeStyles, Paper, Fab, TextField, Link, Tooltip } from "@material-ui/core"
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { askQuestion, beginClearingAnswers, endUserSession, logout, setStudentsList } from "../redux/actions/actions";
import { createTheme, responsiveFontSizes, ThemeProvider } from '@material-ui/core/styles';

import LoginLoading from "./LoginLoading";
import LoginError from "./LoginError";

let theme = createTheme();
theme = responsiveFontSizes(theme);

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        maxWidth: '100vw',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '35px',
    },
    floating: {
        position: 'absolute',
        top: '10px',
        right: '5%',
    },
    submitDiv: {
        width: '50%',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '50px',
    },
    allStudents: {
        width: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        padding: '25px',
        gap: '2rem',
    },
    student: {
        display: 'flex',
        flexDirection: 'column',
        minWidth: '30%',
        gap: '1rem',
    },
    studentTextArea: {
        outline: '#4456b7',
    },
    alignLeft: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: '1rem',
        padding: '25px',
        width: '100%',
    },
    dashboardDiv: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '95%',
        marginTop: '25px',
        flexWrap: 'wrap',
    },
    endSessionDiv: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '50px',
        flexWrap: 'wrap',
    },
    askQuestionDiv: {
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '1rem',
        width: '100%',
    },
});

export default function Main() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const students = useSelector(state => state.studentsList)
    const session = useSelector(state => state.session)
    const endSession = useSelector(state => state.endSession)
    const clearAnswers = useSelector(state => state.clearAnswers)
    const unsubscribe = useSelector(state => state.listener)
    const listRef = useRef()
    const questionRef = useRef()


    const logoutHandler = () => {
        unsubscribe()
        dispatch(logout())
    }

    const endSessionHandler = () => {
        dispatch(endUserSession(session.session, user.user.email))
        unsubscribe()
    }

    const submitHandler = () => {
        if (listRef.current.value.trim().length === 0) {
            alert('Students list cannot be empty! Please try again!')
            return
        }
        let studentNames = listRef.current.value.split(/[,\n]/g)
        studentNames = studentNames.map(name => {
            let newName = name.trim()
            if (newName.length) {
                newName = newName[0].toUpperCase() + newName.substring(1)
            }
            return newName
        }).filter(name => name.length > 0)
        console.log(studentNames)
        let studentNameSet = new Set(studentNames)
        if (studentNameSet.size !== studentNames.length) {
            alert('Please enter Unique student names! The current list has repeated names! Try Again!!')
            return
        }
        studentNameSet = null
        dispatch(setStudentsList(studentNames, user.user.email))
        listRef.current.value = ''
    }

    const clearAnswersHandler = () => {
        questionRef.current.value = ''
        dispatch(beginClearingAnswers(user.user.email))
    }

    const askQuestionHandler = () => {
        if (questionRef.current.value.trim().length) {
            dispatch(askQuestion(user.user.email, questionRef.current.value, session.session))
        }
    }

    return (
        <ThemeProvider theme={theme}>
            <Paper className={classes.container}>
                {user.user && <Tooltip title='Logout' arrow placement='left'><Fab onClick={logoutHandler} className={classes.floating}>
                    <img src={user.user?.photoURL} alt='' style={{ borderRadius: '50%', width: '100%' }} />
                </Fab></Tooltip>}
                {
                    (user.user && session.isRetrieving) || user.user === undefined ? <LoginLoading /> : user.user && !session.isRetrieving && !session.error ?
                        <>
                            {
                                !session.session && !session.error ?
                                    <>
                                        <Paper elevation={0} className={classes.alignLeft}>
                                            <Typography variant='h2' component='h2'>My Students</Typography>
                                            <Typography variant='h6' component='h6'>Enter the name of each person who will answer your questions, separated by comma, or new line</Typography>
                                            <TextField
                                                variant="outlined"
                                                multiline rows='15'
                                                color='primary'
                                                placeholder='e.g. Amit, Francis, Andrew, Nithya'
                                                inputRef={listRef}
                                                style={{ width: '100%' }}
                                            />
                                            <Paper elevation={0} className={classes.submitDiv}>
                                                <Button
                                                    color='primary'
                                                    variant='contained'
                                                    onClick={submitHandler}
                                                >
                                                    Submit
                                                </Button>
                                                <Typography variant='h6' component='h6'>{students.isSubmitting ? 'Submitting...' : students.error ? students.error : ''}</Typography>
                                            </Paper>
                                        </Paper>
                                    </> : session.session && !session.error &&
                                    <>
                                        <Paper elevation={0} className={classes.alignLeft}>
                                            <Paper elevation={0} className={classes.dashboardDiv}>
                                                <Paper elevation={0} className={classes.endSessionDiv}>
                                                    <Typography variant='h3' component='h3'>Dashboard</Typography>
                                                    <Button
                                                        variant='contained'
                                                        color='primary'
                                                        onClick={clearAnswersHandler}
                                                        disabled={clearAnswers.isClearing || endSession.isEndingSession}
                                                    >
                                                        Clear Answers
                                                    </Button>
                                                </Paper>
                                                <Paper elevation={0} className={classes.endSessionDiv}>
                                                    <Typography
                                                        variant='subtitle1'
                                                        component='p'
                                                    >
                                                        {endSession.isEndingSession && !endSession.error ? 'Ending Session...' : endSession.error}
                                                        {clearAnswers.isClearing && !clearAnswers.error ? 'Clearing Answers...' : clearAnswers.error}
                                                    </Typography>
                                                    <Button
                                                        variant='contained'
                                                        onClick={endSessionHandler}
                                                        disabled={clearAnswers.isClearing || endSession.isEndingSession}
                                                    >
                                                        End Session
                                                    </Button>
                                                </Paper>
                                            </Paper>
                                            <Typography
                                                variant='subtitle1'
                                                component='p'>{`Students Link : `}
                                                <Link
                                                    target="_blank"
                                                    rel="noreferrer noopener"
                                                // href={`${window.location.href}${session.session}`}
                                                >
                                                    {window.location.href}{session.session}
                                                </Link>
                                            </Typography>
                                            <Paper className={classes.askQuestionDiv} elevation={0}>
                                                <Typography variant='h4' component='p'>Question :</Typography>
                                                <TextField variant='outlined' color='primary' style={{ width: '70%' }} inputRef={questionRef} />
                                                <Button variant='contained' color='primary' onClick={askQuestionHandler}>Ask</Button>
                                            </Paper>
                                            <Paper className={classes.allStudents} elevation={0}>
                                                {
                                                    students.list.map((student, index) =>
                                                        <Paper className={classes.student} elevation={0} key={index}>
                                                            <Typography style={{ color: '#4456b7' }}>{student[0]}</Typography>
                                                            <TextField
                                                                className={classes.studentTextArea}
                                                                variant="outlined"
                                                                multiline
                                                                rows='5'
                                                                color='primary'
                                                                value={student[1]}
                                                                placeholder={student[0]}
                                                                focused
                                                            />
                                                        </Paper>)
                                                }
                                            </Paper>
                                        </Paper>
                                    </>
                            }
                        </> : <LoginError />
                }
            </Paper>
        </ThemeProvider>
    )
}