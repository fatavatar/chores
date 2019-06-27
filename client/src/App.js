import React, {useState, useEffect} from 'react';
import './App.css';
import ChoreList from './ChoreList'
import UserInfo from './UserInfo'
import Login from './Login'
import NewChore from './NewChore'
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Container } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';


const apihost='https://api.chores.thelucks.org/'

function App() {
  const [chores, setChores] = useState([])
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [loggedIn, setLoggedIn] = useState(cookies.user)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (loggedIn) {
        // console.log(cookies.user.name)

        const result = await axios(
          apihost + 'chores' 
        );

        // console.log(result)

        setChores(result.data.data.filter( (item, index) => {
         // console.log(item)
          return item.validFor.includes(cookies.user.name)
        }));

        const result1 = await axios(
          apihost + 'getTime/' + cookies.user.name
        )
        setTime(result1.data.rewards)
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
        apihost + 'start/' + id + '/' + cookies.user.name
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
    cancelChore: async(id) => {
      console.log("Cancelling chore " + id)

      const result = await axios(
        apihost + 'cancel/' + id + '/' + cookies.user.name
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
    stopChore: async(id, photoData) => {
      console.log("Stopping chore " + id)

      const formData = new FormData();
      formData.append('photo',photoData)
      const config = {
          headers: {
              'content-type': 'multipart/form-data'
          }
      }
      const result = await axios.post(
        apihost + 'stop/' + id + '/' + cookies.user.name,
        formData, config
      );

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
    },

    redeem: async (type) => {
      const result = await axios(apihost + 'redeem/'+ type + '/' + cookies.user.name)
      console.log(result)
      if (result.data.success) {
        alert("Successfully added 15 minutes to " + type)
      } else {
        alert("Error redeeming your time!")
      }
    }
  }

  return (
    <React.Fragment>      
    <CssBaseline />
    <Container maxWidth="md" style={{padding:'0px 0px 0px 0px'}} >
      {loggedIn ? (
        <UserInfo user={cookies.user.name} actions={actions} rewards={time}/>
      ) : (
        <Login apihost={apihost} actions={actions}/>
      )}
      { loggedIn && !cookies.user.isAdmin &&<ChoreList user={cookies.user.name} chores={chores} actions={actions} /> }       
      { loggedIn && cookies.user.isAdmin && <NewChore actions={actions} /> }       

    </Container>
    </React.Fragment>

  );
}

export default App;
