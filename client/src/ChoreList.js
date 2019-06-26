import React, {useState} from "react"
import ReactMarkdown from 'react-markdown'
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import Icon from '@material-ui/core/Icon';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { Typography } from "@material-ui/core";
import { css } from '@material-ui/system';


function Chore(props) {

  const [shown, setShown] = useState(false)
  const canStart = !props.isBusy && props.chore.beingDoneBy === "" && Date.now() > (Date.parse(props.chore.lastEndTime) + props.chore.repeatDelay)
  const canStop = props.user === props.chore.beingDoneBy



  return(
    <ListItem onClick={props.showChore} divider button>
    <ListItemText primary={props.chore.choreName} 
    secondary={props.chore.beingDoneBy === "" ? "Reward: " + props.chore.reward + " minutes" : "Being done by " + props.chore.beingDoneBy} >


    </ListItemText> 
    {/* <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="Start Chore">
        <Icon>work</Icon>
      </IconButton>
    </ListItemSecondaryAction> */}
        {/* <span onClick={() => setShown(!shown)}>{props.chore.choreName}</span> - {props.chore.reward} - { canStart && <Button variant="contained" color="primary" onClick={props.startChore}>Start Chore</Button> }
    {props.chore.beingDoneBy} { canStop && <form ><input type="file" name="image" accept="image/*" capture="user" onChange={pictureTaken} /></form> } */}
    
    {shown &&
      <div>
      </div>
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
      {!isBusy && <Button variant="contained" color="primary" onClick={() => {props.actions.startChore(props.chores[showChore]._id)}} >Start Chore</Button> }
      { props.chores[showChore].beingDoneBy === props.user && 
      <div>
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