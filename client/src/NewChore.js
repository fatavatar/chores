import React from 'react';
import useBasicForm from './custom-hooks';
import {Checkbox, CheckboxGroup} from 'react-checkbox-group';
import axios from 'axios';


const NewChore = () => {
  const newChore = async () => {
    const result = await axios.post(
      'http://localhost:3001/addChore', inputs
    );

    // console.log(result)
    if (result.data.success) {
      alert("Saved Successfully")
    } else {
      alert(result.data.error)
    }
    
  }
  const {inputs, handleInputChange, handleSubmit} = useBasicForm({name: '', repeatDelay: 0, reward: 0, users: [], description: ''}, newChore);
  return (
    <div className="section is-fullheight">
      <div className="container">
        <div className="column is-4 is-offset-4">
          <div className="box">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="field">
                <label className="label has-text-centered">Chore Name</label>
                <div className="control">
                  <input className="input" type="text" name="name" onChange={handleInputChange} value={inputs.name} required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-centered">Reward (minutes)</label>
                <div className="control">
                  <input className="input" type="text" name="reward" onChange={handleInputChange} value={inputs.reward} required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-centered">Can be done again in (hours)</label>
                <div className="control">
                  <input className="input" type="text" name="repeatDelay" onChange={handleInputChange} value={inputs.repeatDelay} required />
                </div>
              </div>
              <div className="field">
                <label className="label has-text-centered">For Who?</label>
                <div className="control">
                <CheckboxGroup checkboxDepth={2} name="users" value={inputs.users} onChange={(values) => {
                    var wrappedValue = { persist: () => {}, target: {name: "users", value: values} }
                    handleInputChange(wrappedValue)}} required >
                  <label><Checkbox value="Hugo"/> Hugo </label>
                  <label><Checkbox value="Brody"/> Brody </label>
                  <label><Checkbox value="Kiefer"/> Kiefer </label>
                </CheckboxGroup>
                </div>
              </div>
              <div className="field">
                <label className="label has-text-centered">Description</label>
                <div className="control">
                  <textarea className="input" cols="50" rows="20" name="description" onChange={handleInputChange} value={inputs.description}/>
                </div>
              </div>
              <button className="button is-block is-fullwidth is-success" type="submit">Create</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NewChore;