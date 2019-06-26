import React, {useState} from "react"
import ReactMarkdown from 'react-markdown'

function Chore(props) {

  const [shown, setShown] = useState(false)
  const canStart = !props.isBusy && props.chore.beingDoneBy === "" && Date.now() > (Date.parse(props.chore.lastEndTime) + props.chore.repeatDelay)
  const canStop = props.user === props.chore.beingDoneBy

  function pictureTaken(event) {
    props.stopChore(event.target.files[0])
  }

  return(
    <div><span onClick={() => setShown(!shown)}>{props.chore.choreName}</span> - {props.chore.reward} - { canStart && <button onClick={props.startChore}>Start Chore</button> }
    {props.chore.beingDoneBy} { canStop && <form ><input type="file" name="image" accept="image/*" capture="user" onChange={pictureTaken} /></form> }
    
    {shown &&
      <div>
        <ReactMarkdown source={props.chore.description} />
      </div>
    }
    </div>
  )
}

export default function ChoreList(props) {

  const isBusy = props.chores.filter((item, index) => {
    return item.beingDoneBy === props.user
  }).length > 0
  return(
    <div>
      {props.chores.map((item,index) => (
        <Chore chore={item}          
               key={item._id} 
               user={props.user}     
               isBusy={isBusy}
               startChore={ () => {props.actions.startChore(item._id)}}
               stopChore={ (image) => {props.actions.stopChore(item._id, image)}}
              />
      ))}
    </div>
  )
}