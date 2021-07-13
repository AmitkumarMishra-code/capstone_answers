import { LinearProgress, makeStyles, Paper, Typography } from "@material-ui/core";
const useStyles = makeStyles({
    loadingPage:{
        display:'flex',
        width:'100%',
        padding: '50px',
        gap:'2rem',
        flexDirection:'column',
    },
});
export default function LoginLoading() {
    const classes = useStyles()
    return (
        <Paper elevation={0} className = {classes.loadingPage}>
            <Typography variant='h4' component='h4'>Loading</Typography>
            <LinearProgress />
        </Paper>
    )
}