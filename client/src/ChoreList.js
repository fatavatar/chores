import React, {useState} from "react"
import ReactMarkdown from 'react-markdown'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";


function Chore(props) {

  
  const timeTillActive = (Date.parse(props.chore.lastEndTime) + (props.chore.repeatDelay * 60 * 60 * 1000)) - Date.now()  
  const canStop = props.chore.beingDoneBy === props.user
  const showTitle = props.chore.beingDoneBy === "" && timeTillActive <= 0
  const canStart = !props.isBusy && timeTillActive <= 0 && props.chore.beingDoneBy === ""

  const minutes = Math.floor((timeTillActive / (1000 * 60)) % 60);
  const hours = Math.floor((timeTillActive / (1000 * 60 * 60)) % 24);
  const days = Math.floor(timeTillActive / (1000 * 60 * 60 * 24));

  return(
    <ListItem onClick={props.showChore} divider disabled={!canStart && !canStop} selected={canStop} button>
      {showTitle && <ListItemText primary={props.chore.choreName} secondary={ "Reward: " + props.chore.reward + " minutes" }/> }
      {props.chore.beingDoneBy !== "" && <ListItemText primary={props.chore.choreName} secondary={ "Being done by " + props.chore.beingDoneBy} /> }
      {timeTillActive > 0 && 
      <ListItemText primary={props.chore.choreName} 
        secondary={ "Ready in " + (days > 0 ? days + " day(s) " : (hours > 0 ? hours + " hour(s) " : (minutes > 0 ? minutes + " minute(s)" : "")))} /> 
      }
    </ListItem>

  )
}

export default function ChoreList(props) {
  const [showChore, setShowChore] = useState(-1)

  function displayChore(choreIndex)  {
    console.log("Showing Chore")
    setShowChore(choreIndex)
  }

  function pictureTaken(event) {
    props.actions.stopChore( props.chores[showChore]._id, event.target.files[0])
  }

  const isBusy = props.chores.filter((item, index) => {
    return item.beingDoneBy === props.user
  }).length > 0
  
  return(
    <div>

      {showChore !== -1 &&

      <Box css={{ margin: '20px'}}>
          <Grid container alignItems="center">
          <Grid item xs>
          </Grid>
          <Grid item>
          <IconButton edge="end" aria-label="Start Chore" onClick={() => {displayChore(-1)}}>
        <Icon fontSize="large" >close</Icon>
      </IconButton>
                </Grid>
        </Grid>
        <p></p>
          <Grid container alignItems="center">
          <Grid item xs>
            <Typography variant="h4">{props.chores[showChore].choreName}</Typography>

          </Grid>
          <Grid item>
      {!isBusy && 
        props.chores[showChore].beingDoneBy === "" &&  
        ((Date.parse(props.chores[showChore].lastEndTime) + (props.chores[showChore].repeatDelay * 60 * 60 * 1000)) - Date.now()) <= 0  && 
        <Button variant="contained" color="primary" onClick={() => {props.actions.startChore(props.chores[showChore]._id)}} >Start Chore</Button> 
      }
      
      { props.chores[showChore].beingDoneBy === props.user && 
      <div>
      <Button variant="contained" 
        style={{margin:'0px 10px 0px 0px'}} 
        onClick={() => {props.actions.cancelChore(props.chores[showChore]._id)}}>
          Cancel
      </Button>

      <input
      accept="image/*"
      name="image"
      style={{ display: 'none' }}
      id="raised-button-file"
      capture="environment"
      type="file"
      onChange={pictureTaken}
      css={{display:'none'}}
      /><label htmlFor="raised-button-file">
      <Button variant="contained" color="primary" component="span" >
        Complete
      </Button>
      </label> 
      </div>
         // <form ><input type="file" name="image" accept="image/*" capture="user"v /></form> 
         } 
          </Grid>
        </Grid>
            <Typography>
            <ReactMarkdown source={props.chores[showChore].description} />
            </Typography>
            </Box>

        
      }
            {showChore === -1 &&
      <List dense={false}>
      {props.chores.map((item,index) => (
        <Chore chore={item}     
               showChore={() => {displayChore(index)}}     
               key={item._id} 
               user={props.user}     
               isBusy={isBusy}
               stopChore={ (image) => {props.actions.stopChore(item._id, image)}}
              />
      ))}
      </List> 
      }
    </div>
  )
}
