import React from "react"
import { AppBar, Toolbar, Typography, IconButton, Icon } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function UserInfo(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>

    <AppBar position="static">
    <Toolbar>
      <Typography className={classes.title} variant="h6">
        {props.user} : {props.rewards} minutes
      </Typography>

      <IconButton color="inherit" aria-label="Add time to TV/Consoles" onClick={() => {props.actions.redeem("tv")}}>
        <Icon>
          personal_video
        </Icon>
      </IconButton>
      <IconButton color="inherit" aria-label="Add time to devices" onClick={() => {props.actions.redeem("devices")}}>
        <Icon>
        stay_primary_portrait
        </Icon>
      </IconButton>
      <IconButton color="inherit" aria-label="logout" onClick={() => {props.actions.logout()}}>
        <Icon>
          logout
        </Icon>
      </IconButton>
    </Toolbar>
    </AppBar>
    </div>
    // {props.user}: {props.rewards}  <button onClick={() => {props.actions.redeem("tv")}}>Add 15m to TV/Consoles</button>  <button onClick={() => {props.actions.redeem("devices")}}>Add 15m to devices</button> <button onClick={() => {props.actions.logout()}}>Logout</button>
  )
}