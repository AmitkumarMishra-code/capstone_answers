import { Button, FormControl, InputLabel, makeStyles, MenuItem, Paper, Select, Typography } from "@material-ui/core";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { retrieveStudentList } from "../redux/actions/actions";
import { SET_STUDENT_NAME } from "../redux/actions/action_types";

const useStyles = makeStyles({
    formControl: {
        minWidth: 180,
    },
    studentsContainer: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: '1rem',
        minHeight: '100vh',
        padding: '5% 15%'
    },
});

export default function Students(props) {
    const classes = useStyles()
    const dispatch = useDispatch()
    const studentSession = useSelector(state => state.studentSession)
    const studentName = useSelector(state => state.studentName)
    const history = useHistory()
    const changeHandler = (e) => {
        dispatch({
            type: SET_STUDENT_NAME,
            payload: e.target.value
        })
    }

    const clickHandler = () => {
        if (!studentName.length) {
            alert('Please select a name from the list!')
            return
        }
        history.push({
            pathname: `/${props.match.params.id}/${studentName}`,
            state: { name: studentName }
        })
    }

    useEffect(() => {
        let sessionId = props.match.params.id
        dispatch(retrieveStudentList(sessionId))
        // eslint-disable-next-line
    }, [])

    return (
        <Paper elevation={0} className={classes.studentsContainer}>
            <Typography variant='h3' component='h3'>Select Your Name</Typography>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="select-name">Name</InputLabel>
                <Select
                    labelId="select-name"
                    id="select-name"
                    onChange={changeHandler}
                    label="Name"
                    required
                    disabled={studentSession.isRetrieving}
                    value={studentName}
                >
                    {studentSession.list.length > 0 && studentSession.list.map((student, idx) => <MenuItem value={student} key={idx}>{student}</MenuItem>)}
                </Select>
            </FormControl>
            <Button
                variant='contained'
                color='primary'
                onClick={clickHandler}
            >
                Continue
            </Button>
        </Paper>
    )
}