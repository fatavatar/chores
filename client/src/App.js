import React, {useState, useEffect} from 'react';
import './App.css';
import ChoreList from './ChoreList'
import UserInfo from './UserInfo'
import Login from './Login'
import NewChore from './NewChore'
import { useCookies } from 'react-cookie';
import axios from 'axios';

function App() {
  const [chores, setChores] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [loggedIn, setLoggedIn] = useState(cookies.user)


  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        // console.log(cookies.user.name)

        const result = await axios(
          'http://localhost:3001/chores' 
        );

        // console.log(result)

        setChores(result.data.data.filter( (item, index) => {
         // console.log(item)
          return item.validFor.includes(cookies.user.name)
        }));
      }
    };

    fetchData();
    var interval = setInterval(() => { if (loggedIn) fetchData()}, 5000)


    return () => {      
      clearInterval(interval);
    }
  }, [loggedIn, cookies.user])

  var actions = {
    startChore: async(id) => {
      console.log("Starting chore " + id)

      const result = await axios(
        'http://localhost:3001/start/' + id + '/' + cookies.user.name
      );

      console.log(result)
      if (result.data.success) {
        setChores(result.data.chores.filter( (item, index) => {
        // console.log(item)
         return item.validFor.includes(cookies.user.name)
       }));
      }
      else console.log(result.data.error)
    },

    stopChore: async(id) => {
      console.log("Stopping chore " + id)

      const result = await axios(
        'http://localhost:3001/stop/' + id + '/' + cookies.user.name
      );

      console.log(result)
      if (result.data.success)  {
        setChores(result.data.chores.filter( (item, index) => {
        // console.log(item)
         return item.validFor.includes(cookies.user.name)
       }));
      }
      else console.log(result.data.error)
    },

    login: (user) => {    
      setCookie('user',user)
      console.log("Logging in " + user.name)
  
      setLoggedIn(true)
    },

    logout: () => {
      removeCookie('user')
      setLoggedIn(false)
    }
  }

  return (
    <div className="App">
      {loggedIn ? (
        <UserInfo user={cookies.user.name} actions={actions}/>
      ) : (
        <Login actions={actions}/>
      )}
      { loggedIn && !cookies.user.isAdmin &&<ChoreList user={cookies.user.name} chores={chores} actions={actions} /> }       
      { loggedIn && cookies.user.isAdmin && <NewChore actions={actions} /> }       

    </div>
  );
}

export default App;
