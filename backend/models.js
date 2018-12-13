var mongoose = require('mongoose');

if (! process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI);

var userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  games: Array,
});

var gameSchema = new mongoose.Schema({
  winner: String,
  turn: String,
  completed: Boolean,
  board: Array,
  takenPieces: Object,
  players: Array,
  createdAt: Date
});

var User = mongoose.model('User', userSchema)
var Game = mongoose.model('Game', gameSchema)

module.exports = {User, Game};
