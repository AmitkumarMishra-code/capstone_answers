import { makeStyles, Paper, TextField, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {  SET_STUDENT_NAME } from "../redux/actions/action_types";


const useStyles = makeStyles({
    studentContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        gap: '1rem',
        minHeight: '100vh',
        padding: '5% 10%',
    },
});

export default function Student() {
    const classes = useStyles()
    const studentName = useSelector(state => state.studentName)
    const answerRef = useRef()
    const history = useHistory()
    const dispatch = useDispatch()

    useEffect(() => {
        if(studentName.name === ''){
            if(history.location.state)
            dispatch({
                type: SET_STUDENT_NAME,
                payload: history.location.state.name
            })
            else{
                history.push('/404')
            }
        }
        // eslint-disable-next-line
    },[])



const changeHandler = () => {
    console.log('change handler called: ' + answerRef.current.value)
}

    return (
        <Paper elevation={0} className={classes.studentContainer}>
            <Typography variant='subtitle2' component='p'>{studentName.name}</Typography>
            <Typography variant='h2' component='h2'>My Answer</Typography>
            <Typography variant='subtitle2' component='p'>Enter your answer below. This text is visible to the teacher.</Typography>
            <TextField
                variant="outlined"
                multiline rows='15'
                color='primary'
                placeholder='Enter your Answer here...'
                inputRef={answerRef}
                style={{ width: '100%' }}
                onChange = {changeHandler}
            />
            <Typography variant = 'subtitle2' component = 'p' style ={{fontSize:'14px'}}></Typography>
        </Paper>
    )
}