import React, {useState, useEffect} from 'react';
import './App.css';
import ChoreList from './ChoreList'
import UserInfo from './UserInfo'


var initialChores = [
  {id: 1, choreName: "Chore Task 1", reward: 15, nextStartTime: 0, inUseBy: ""},
  {id: 2, choreName: "Chore Task 2", reward: 15, nextStartTime: 0, inUseBy: ""},
  {id: 3, choreName: "Chore Task 3", reward: 15, nextStartTime: 0, inUseBy: ""},
  {id: 4, choreName: "Chore Task 4", reward: 15, nextStartTime: 0, inUseBy: ""},
  {id: 5, choreName: "Chore Task 5", reward: 15, nextStartTime: 0, inUseBy: ""},
  {id: 6, choreName: "Chore Task 6", reward: 15, nextStartTime: 0, inUseBy: ""},
]


function App(props) {
  const [chores, setChores] = useState([])
  const [user, setUser] = useState([])
  return (
    <div className="App">
      <UserInfo user={props.user}/>
      <ChoreList user={props.user} />
    </div>
  );
}

export default App;
