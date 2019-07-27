import React, { Component } from 'react'
import './Auth.css'
class AuthPage extends Component {
  state = {
    isLogin: true
  }
  constructor(props) {

    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();

  }
  switchModeHandler = () => {
    console.log('??')
    this.setState(prevState => {
      
      return { isLogin: !prevState.isLogin };
    })
  }
  submitHandler = async (event) => {
    event.preventDefault();

    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return
    }
    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}" ){
            userId
            token
            tokenExpiration
          }
        }
      `
    };
    if (this.state.isLogin) {
      requestBody = {
        query: `
          mutation{
            createUser(userInput: {email: "${email}", password: "${password}" }){
              _id
              email
            }
          }
        `
      };
    }

    try {
      const result = await fetch('http://localhost:8000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (result.status !== 200 && result.status !== 201) {
        throw new Error('Failed!')
      }
      console.log(await result.json())

    } catch (e) {
      console.log(e)
    }
  }


  render() {
    return <form className="auth-form" onSubmit={this.submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-mail</label>
        <input type="email" id="emil" ref={this.emailEl}></input>
      </div>
      <div className="form-control">
        <label htmlFor="password">password</label>
        <input type="password" id="password" ref={this.passwordEl}></input>
      </div>
      <div className="form-actions">
        <button type="button"  onClick={this.switchModeHandler} > Switch to {this.state.isLogin ? 'Sign Up' : 'Sign In'}</button>
        <button type="submit" >Submit</button>
      </div>
    </form>
  }
}

export default AuthPage