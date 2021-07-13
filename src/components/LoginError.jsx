import { makeStyles, Paper, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
const useStyles = makeStyles({
    errorPage:{
        display:'flex',
        width:'100%',
        padding: '50px',
        gap:'2rem',
        flexDirection:'column',
    },
});

export default function LoginError(){
    const classes = useStyles()
    const error = useSelector(state => state.session.error)
    return (
        <Paper elevation = {0} className = {classes.errorPage}>
            <Typography variant = 'h4' component = 'h4'>Error :</Typography>
            <Typography variant = 'subtitle1' component = 'p'>{error}</Typography>
        </Paper>
    )
}