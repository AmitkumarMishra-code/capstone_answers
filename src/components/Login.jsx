import { Avatar, Button, makeStyles, Paper, Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { startLogin } from "../redux/actions/actions";
import AccountCircleSharpIcon from '@material-ui/icons/AccountCircleSharp'
import { useEffect } from "react";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        minHeight: '100vh',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '35px',
    },
});

export default function Login(){
    const dispatch = useDispatch()
    const user = useSelector(state => state.user)
    const classes = useStyles()
    const history = useHistory()

    useEffect(() => {
        if(user.user!==null){
            history.push('/')
        }
    },[user.user, history])

    const loginHandler = () => {
        dispatch(startLogin())
    }
    return(
        <Paper className = {classes.container}>
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
        </Paper>
    )
}