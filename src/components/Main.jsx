import { Avatar, Button, Typography, makeStyles, Paper, Fab, TextField, Link } from "@material-ui/core"
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp'
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserSessionInformation, logout, setStudentsList, startLogin } from "../redux/actions/actions";
import firebase from '../firebaseConfig'
import { SET_USER } from "../redux/actions/action_types";
import LoginLoading from "./LoginLoading";
import LoginError from "./LoginError";


const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '25px',
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
        width: '30%',
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
    },
});

export default function Main() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const students = useSelector(state => state.studentsList)
    const session = useSelector(state => state.session)
    const listRef = useRef()

    useEffect(() => {
        firebase.auth().onAuthStateChanged(async(user) => {
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

    const loginHandler = () => {
        dispatch(startLogin())
    }

    const logoutHandler = () => {
        dispatch(logout())
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

    return (
        <Paper className={classes.container}>
            {user.user && <Fab onClick={logoutHandler} className={classes.floating}>
                <img src={user.user?.photoURL} alt='' style={{ borderRadius: '50%', width: '100%' }} />
            </Fab>}
            {!user.user && !session.session ?
                <>
                    <Typography variant='h2' component='h2'>Everyone Answers</Typography>
                    <Typography variant='h6' component='h6'>Welcome. Please Sign In.</Typography>
                    <AccountCircleSharpIcon style={{ fontSize: 100 }} color='disabled' />
                    <Button
                        variant="contained"
                        startIcon={<Avatar src={"https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"} />}
                        onClick={loginHandler}
                        disabled={user.isLoggingIn}
                    >
                        Sign In With Google
                    </Button>
                    {user.error && <Typography variant='h6' component='h6'>{user.error}</Typography>}
                </> :

                user.user && session.isRetrieving ? <LoginLoading /> : user.user && !session.isRetrieving && !session.error ?
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

                                        <Typography variant='h2' component='h2' >Dashboard</Typography>
                                        <Typography variant='subtitle1' component='p'>Students Link: <Link target="_blank" rel="noreferrer noopener" href={`${window.location.href}${session.session}`}>{window.location.href}{session.session}</Link></Typography>
                                        <Paper className={classes.allStudents} elevation={0}>
                                            {students.list.map((student, index) =>
                                                <Paper className={classes.student} elevation={0} key={index}>
                                                    <Typography style={{ color: '#4456b7' }}>{student}</Typography>
                                                    <TextField
                                                        className={classes.studentTextArea}
                                                        variant="outlined"
                                                        multiline
                                                        rows='5'
                                                        color='primary'
                                                        placeholder={student}
                                                        focused
                                                    />
                                                </Paper>)}
                                        </Paper>
                                    </Paper>
                                </>
                        }
                    </> : <LoginError />

            }
        </Paper>
    )
}