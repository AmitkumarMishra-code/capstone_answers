import { makeStyles, Paper, Typography } from "@material-ui/core";

const useStyles = makeStyles({
    noMatchContainer:{
        display:'flex',
        width:'100%',
        flexDirection:'column',
        gap:'1rem',
        minHeight:'100vh',
        justifyContent:'flex-start',
        alignItems:'center',
        paddingTop:'5%',
    },
});

export default function NoMatch(){
    const classes = useStyles()
    return(
        <Paper elevation = {0} className = {classes.noMatchContainer}>
            <Typography variant = 'h2' component = 'h2'>404: Page Not Found!</Typography>
        </Paper>
    )
}