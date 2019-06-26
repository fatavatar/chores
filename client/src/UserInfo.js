import React from "react"

export default function UserInfo(props) {
  return (
    <div>{props.user}: {props.rewards}  <button onClick={() => {props.actions.redeem("tv")}}>Add 15m to TV/Consoles</button>  <button onClick={() => {props.actions.redeem("devices")}}>Add 15m to devices</button> <button onClick={() => {props.actions.logout()}}>Logout</button></div>
  )
}