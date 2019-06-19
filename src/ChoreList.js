import React, {useState, useEffect} from "react"

function Chore(props) {
  const canStart = !props.user
  const canStop = props.user === props.currentUser

  if (props.user) {
    const canStart = false
  } 

  return(
    <div>{props.name} - {props.time} - { canStart && <button onClick={props.startChore}>Start Chore</button> }
    {props.user} { canStop && <button onClick={props.stopChore}>Finish</button>}
    </div>
  )
}

export default function ChoreList(props) {
  const [chores, setChores] = useState([])
  
  useEffect(() => {
    const chore1 = {name: "Chore 1", time: "15", id: 15}
    setChores([chore1])
  }, [])

  function startChore(id) {
    console.log("Starting chore " + id)
    const newchore = chores.find((chore) => {
      return chore.id === id
    })
    const oldChores = chores.filter((chore) => {
      return chore.id !== id
    })
    newchore.user = props.user
    setChores([...oldChores, newchore])

  }
  
  return(
    <div>
      {chores.map((item,index) => (
        <Chore name={item.name} 
               time={item.time} 
               key={item.id} 
               user={item.user} 
               currentUser={props.user} 
               startChore={() => {startChore(item.id)}
              }/>
      ))}
    </div>
  )
}