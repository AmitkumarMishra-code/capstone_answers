import { Avatar, Button, Typography, makeStyles, Paper, Fab, TextField } from "@material-ui/core"
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp'
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout, startLogin } from "../redux/actions/actions";
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
    }
});

export default function Main() {
    const classes = useStyles()
    const dispatch = useDispatch()
    const user = useSelector(state => state)

    useEffect(() => {
        console.log('useEffect called')
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              dispatch({
                  type:SET_USER,
                  payload: user
              })
            }
            else{
                dispatch(logout())
            } 
          });
        // eslint-disable-next-line 
    },[])

    const loginHandler = () => {
        dispatch(startLogin())
    }

    const logoutHandler = () => {
        dispatch(logout())
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
                    <TextField variant="outlined" multiline rows='10' color='primary' placeholder='e.g. Amit, Francis, Andrew, Nithya' style={{ width: '50%' }}></TextField>
                    <Button color='primary' variant='contained'>Submit</Button>
                </>
            }
        </Paper>
    )
}