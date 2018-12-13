import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';

export default class Login extends Component {
  state = {
    username: null,
    password: null,
    snack: false
  }
  // Make these show a snackbar warning about missing fields if the state is null or blank
  // Show a message and set a base format for the password and email
  setUsername = (e) => {
    this.setState({username: e.target.value})
  }
  setPassword = (e) => {
    this.setState({password: e.target.value})
  }
  onClickLogin = () => {
    this.props.loginUser(this.state.username, this.state.password)
  }
  onClickRegister = () => {
    this.props.registerUser(this.state.username, this.state.password)
    this.setState({snack: true})
  }
  closeSnack = () => {
    this.setState({snack: false})
  }
  render() {
    return (
      <div style = {{overflow: 'none', height: '93vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', backgroundColor: '#d1d1d1'}}>
        <Snackbar anchorOrigin = {{vertical: 'bottom', horizontal: 'left'}}
          open = {this.state.snack} autoHideDuration = {5000} onClose = {this.closeSnack}
          message = {<span> Account Registered! </span>}
        />
        <Typography variant = "h3" style = {{margin: 50}}> Welcome to Socket Chess! </Typography>
        <Typography variant = "h6" style = {{marginBottom: 25, maxWidth: 650, textAlign: 'justify', color: '#4c4c4c'}}>
          This project is powered by Socket.io and ReactJS to provide a real-time
          chess app for two players. Just sign up and share the game link with
          another user to get started.
        </Typography>
        <div>
          <Input placeholder = "email" onChange = {(e) => this.setUsername(e)} style = {{margin: 25, padding: 10}}/>
          <Input placeholder = "password" type = "password" style = {{padding: 10}} onChange = {(e) => this.setPassword(e)}/>
        </div>
        <div>
          <Button onClick = {() => this.onClickLogin()} style = {{marginRight: 30, backgroundColor: '#232323', color: '#ededed'}}> Log In </Button>
          <Button onClick = {() => this.onClickRegister()} style = {{marginLeft: 30, backgroundColor: '#232323', color: '#ededed'}}> Register </Button>
        </div>
      </div>
    )
  }
}
