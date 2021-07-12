import { Avatar, Button, Typography, makeStyles, Paper, Fab, TextField } from "@material-ui/core"
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp'
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, setStudentsList, startLogin } from "../redux/actions/actions";
import firebase from '../firebaseConfig'
import { SET_USER } from "../redux/actions/action_types";


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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default function Main() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const students = useSelector(state => state.studentsList)
    const listRef = useRef()

    useEffect(() => {
        console.log('useEffect called')
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                dispatch({
                    type: SET_USER,
                    payload: user
                })
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
        studentNames = studentNames.map(name => name.trim())
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
            {!user.user &&
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
                </>
            }
            {
                user.user &&
                <>
                    <Fab onClick={logoutHandler} className={classes.floating}>
                        <img src={user.user.photoURL} alt='' style={{ borderRadius: '50%', width: '100%' }} />
                    </Fab>
                    <Typography variant='h2' component='h2'>My Students</Typography>
                    <Typography variant='h6' component='h6'>Enter the name of each person who will answer your questions, separated by comma, or new line</Typography>
                    <TextField
                        variant="outlined"
                        multiline rows='10'
                        color='primary'
                        placeholder='e.g. Amit, Francis, Andrew, Nithya'
                        inputRef={listRef}
                        style={{ width: '50%' }}
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
                </>
            }
        </Paper>
    )
}