import React, { Component } from 'react';
import {BrowserRouter, Route, Switch, NavLink, Redirect} from 'react-router-dom';
import './App.css';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Login from './components/login'
import functions from './functions';
import Auth from './auth';
import Button from '@material-ui/core/Button';
import GamePage from './components/gamepage';

export default class App extends Component {
  state = {authenticated: Auth.isUserAuthenticated()}
  registerUser = (username, password) => {
    fetch('https://cors-anywhere.herokuapp.com/https://chess-backend151.herokuapp.com/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
      .then((resp) => resp.json())
      .then(/* Make a snackbar appear to show the registration was successful*/)
  }
  loginUser = (username, password) => {
    fetch('https://cors-anywhere.herokuapp.com/https://chess-backend151.herokuapp.com/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({username, password})
    })
      .then((resp) => {
        console.log(resp)
        if (resp.status === 200) {
          resp = resp.json()
          .then((resp) => {
            Auth.authenticateUser(resp.token)
            window.location.reload()
          })
        }
        else alert('Wrong Login!')
      })
  }
  logout = () => {
    Auth.deauthenticateUser()
    window.location.reload()
  }
  render() {
    return (
      <BrowserRouter>
        <div>
          <AppBar position = "static" style = {{backgroundColor: '#232323'}}>
            <Toolbar>
              <NavLink to = "/" style = {{textDecoration: 'none'}}>
                <Button> <Typography variant = "subheading" style = {{color: '#ededed'}}> Home </Typography> </Button>
              </NavLink>
              <Button onClick = {() => this.logout()}> <Typography variant = "subheading" style = {{color: '#ededed'}}> Logout </Typography> </Button>
            </Toolbar>
          </AppBar>
          <Switch>
            <Route exact path = "/"
              render = {() => (
                this.state.authenticated ? <Redirect to = "/game_page"/> : <Redirect to = "/login"/>
              )}
            />
            <Route path = "/login"
              render = {() => (
                this.state.authenticated ? <Redirect to = "/"/> : <Login registerUser = {this.registerUser} loginUser = {this.loginUser}/>
              )}/>
            <Route path = "/game_page"
              render = {() => (
                this.state.authenticated ? <GamePage/> : <Redirect to = "/login"/>
              )}/>
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}
