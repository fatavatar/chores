import React, {useState, useEffect} from 'react';
import './App.css';
import axios from 'axios';


export default function Login(props) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        'http://localhost:3001/users'
      );

      console.log(result)
      if (result.data.success) setUsers(result.data.data);
      else console.log(result.data.error)
    };

    fetchData();
  }, [])

  return (
    <div>
    {users.map((item, index) => (
      <button key={item._id} onClick={() => {props.actions.login(item)}} >{item.name}</button>
    ))}  
    </div>  
  )
}
