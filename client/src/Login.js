import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';
import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';


export default function Login(props) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        props.apihost + 'users'
      ); 

      console.log(result)
      if (result.data.success) setUsers(result.data.data);
      else console.log(result.data.error)
    };

    fetchData();
  }, [props.apihost])

  return (
    <Box style={{padding: '10px 10px 10px 10px'}}>
      <Typography variant="h4">
        Select User
      </Typography>
      <List>
    {users.map((item, index) => (
      <ListItem key={item._id} onClick={() => {props.actions.login(item)}} divider button>
      <ListItemText primary={item.name} />
      </ListItem>
    ))}  
    </List>
    </Box>  
  )
}
