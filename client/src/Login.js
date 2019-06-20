import React from 'react';
import './App.css';


export default function Login(props) {
  return (
    <div>
    {props.users.map((item, index) => (
      <button onClick={() => {props.actions.login(index)}} >{item}</button>
    ))}  
    </div>  
  )
}
