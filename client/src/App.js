import React, {useState, useEffect} from 'react';
import './App.css';
import ChoreList from './ChoreList'
import UserInfo from './UserInfo'
import Login from './Login'
import { useCookies } from 'react-cookie';



var initialChores = [
  {id: 1, choreName: "Chore Task 1", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
  {id: 2, choreName: "Chore Task 2", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
  {id: 3, choreName: "Chore Task 3", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
  {id: 4, choreName: "Chore Task 4", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
  {id: 5, choreName: "Chore Task 5", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
  {id: 6, choreName: "Chore Task 6", reward: 15, lastEndTime: 0, repeatDelay: 5000, beingDoneBy: "", description: "Testing 123"},
] 

const users = [ "Hugo", "Brody", "Kiefer" ]


function App() {
  const [chores, setChores] = useState(initialChores)
  const [cookies, setCookie, removeCookie] = useCookies(['username']);
  const [loggedIn, setLoggedIn] = useState(cookies.username)


  useEffect(() => {
    // setChores(initialChores)
    var interval = setInterval(() => setChores(chores.slice()), 1000)
    return () => {      
      clearInterval(interval);
    }
  }, [chores])

  var actions = {
    startChore: (id) => {
      const newchores = chores.slice()
      console.log("Starting chore " + id)
      const newchore = newchores.find((chore) => {
        return chore.id === id
      })
      newchore.beingDoneBy = cookies.username
      setChores(newchores)
    },

    stopChore: (id) => {
      const newchores = chores.slice()
      console.log("Stopping chore " + id)
      const newchore = newchores.find((chore) => {
        return chore.id === id
      })
      newchore.lastEndTime = Date.now()
      newchore.beingDoneBy = ""
      setChores(newchores)
    },

    login: (id) => {    
      setCookie('username',users[id])
      console.log("Logging in " + users[id])
  
      setLoggedIn(true)
    },

    logout: () => {
      removeCookie('username')
      setLoggedIn(false)
    }
  }

  return (
    <div className="App">
      {loggedIn ? (
        <UserInfo user={cookies.username} actions={actions}/>
      ) : (
        <Login users={users} actions={actions}/>
      )}
      { loggedIn &&<ChoreList user={cookies.username} chores={chores} actions={actions} /> }       

    </div>
  );
}

export default App;
