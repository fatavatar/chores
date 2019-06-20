import React, {useState} from "react"

function Chore(props) {

  const [shown, setShown] = useState(false)
  const canStart = props.chore.beingDoneBy === "" && Date.now() > (props.chore.lastEndTime + props.chore.repeatDelay)
  const canStop = props.user === props.chore.beingDoneBy

  return(
    <div><span onClick={() => setShown(!shown)}>{props.chore.choreName}</span> - {props.chore.reward} - { canStart && <button onClick={props.startChore}>Start Chore</button> }
    {props.chore.beingDoneBy} { canStop && <button onClick={props.stopChore}>Finish</button>}
    
    {shown &&
      <div>
      {props.chore.description}
      </div>
    }
    </div>
  )
}

export default function ChoreList(props) {

  return(
    <div>
      {props.chores.map((item,index) => (
        <Chore chore={item}          
               key={item.id} 
               user={props.user}     
               startChore={ () => {props.actions.startChore(item.id)}}
               stopChore={ () => {props.actions.stopChore(item.id)}}
              />
      ))}
    </div>
  )
}