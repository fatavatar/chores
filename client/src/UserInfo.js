import React from "react"

export default function UserInfo(props) {
  return (
    <div>{props.user}: <button onClick={() => {props.actions.logout()}}>Logout</button></div>
  )
}