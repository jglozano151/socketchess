import React, {Component} from 'react';
import Typography from '@material-ui/core/Typography';
import Board from './board';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Auth from '../auth.js';
import Modal from '@material-ui/core/Modal';
import Input from '@material-ui/core/Input';
import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper'; 

function getModalStyle() {
  const top = 50 + Math.round(Math.random() * 20) - 10;
  const left = 50 + Math.round(Math.random() * 20) - 10;
  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  }
}

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4
  }
})

export default class GamePage extends Component {
  state = {
    game: null,
    games: [],
    username: null,
    invitee: null,
  }
  componentWillMount() {
    fetch('/getuser/' + Auth.getToken())
      .then((user) => user.json())
      .then((user) => {
        this.setState({games: user.games, username: user.username})
      })
  }
  changeInvitee = (e) => {
    this.setState({invitee: e.target.value})
  }
  newGame = () => {
    fetch(`/newgame/${this.state.invitee}&${Auth.getToken()}`)
      .then((response) => response.json())
      .then((response) => {
        if (response.valid) window.location.reload()
        else (this.setState({snack: true}))
      })
  }
  closeSnack = () => {
    this.setState({snack: false})
  }
  chooseGame = (game) => {
    this.setState({game: game})
  }
  render() {
    return (
      <div style = {{overflow: 'none', height: '93vh', display: 'flex', justifyContent: 'center', flexDirection: 'row', backgroundColor: '#d1d1d1'}}>
        <Snackbar anchorOrigin = {{vertical: 'bottom', horizontal: 'left'}}
          open = {this.state.snack} autoHideDuration = {4000} onClose = {this.closeSnack}
          message = {<span> Can't find a username "{this.state.invitee}" </span>}/>
        <div style = {{flex: 1, padding: 25}}>
          <Typography variant = "title" style = {{marginBottom: 25, textAlign: 'center', fontFamily: 'Segoe UI'}}> Welcome: {this.state.username} </Typography>
          <Typography variant = "h6" style = {{marginBottom: 25}}> Challenge a Friend! </Typography>
          <Input placeholder = "Username" style = {{padding: 10, marginRight: 25}} onChange = {(e) => this.changeInvitee(e)}/>
          <Button style = {{backgroundColor: '#232323'}} onClick = {() => this.newGame()}>
            <Typography variant = "subheading" style = {{color: '#ededed'}}> New Game </Typography>
          </Button>
          <div style = {{marginTop: 25}}>
            {this.state.games.length === 0 ? <Typography variant = "h6"> <i> No Games, Start a Game! </i> </Typography> :
              this.state.games.map((game) => (
                <div style = {{marginTop: 15, marginBottom: 15}}>
                  <Game game = {game} chooseGame = {this.chooseGame}/>
                </div>
              ))
            }
          </div>
        </div>
        <div style = {{flex: 3, padding: 25}}>
          {this.state.game == null ?
            <Typography variant = "h5"> Choose a game </Typography> :
            <Board game = {this.state.game} username = {this.state.username}/>
          }
        </div>
      </div>
    )
  }
}

class Game extends Component {
  state = {
    game: null
  }
  componentWillMount() {
    console.log(this.props.game)
    fetch('/game/' + this.props.game)
      .then((res) => res.json())
      .then((res) => {
        this.setState({game: res.game})
      })
  }
  onClick = () => {
    this.props.chooseGame(this.state.game)
  }
  render() {
    const createdAt = this.state.game ? this.state.game.createdAt.split('T') : ['', '']; 
    const time = createdAt[1].slice(0, 5); 
    const date = createdAt[0]
    return (
      this.state.game == null || this.state.game.players == undefined ? <div/> :
      <Paper style = {{padding: 15, display: 'flex', flexDirection: 'row'}}>
        <div style = {{flex: 2}}> 
          <Typography variant = "subheading"> <b> Started: </b> {date} at {time} </Typography>
          <Typography variant = "subheading"> <b> White: </b> {this.state.game.players[0]} </Typography>
          <Typography variant = "subheading"> <b> Black: </b> {this.state.game.players[1]} </Typography>
        </div> 
        <div style = {{marginLeft: 20, flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end'}}> 
          <Button onClick = {() => this.onClick()} variant = "contained" style = {{backgroundColor: '#232323', color: '#ededed'}}> Play! </Button>  
        </div> 
      </Paper>
    )
  }
}
