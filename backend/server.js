// Set up express server and import dependencies
var express = require('express');
var path = require('path')
var app = express()
var bodyParser = require('body-parser');
var server = require('http').Server(app);
var io = require('socket.io')(server);
const port = 5000;

app.use(express.static(path.join(__dirname, 'src')));
app.use(bodyParser.json())

// Set up passport, import models
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var models = require('./models.js');
var User = models.User;
var Game = models.Game;

// Passport middleware - Local strategy
passport.use(new LocalStrategy( function (username, password, cb){
  // User model has email, password, name
  models.User.findOne({username: username}, function (err, user) {
    if (err) {
      console.error(err);
      cb(err);
    } else if (!user) {
      console.log(user);
      cb(null, false, { message: 'Incorrect email. ' });
    } else if (user.password !== password) {
      cb(null, false, { message: 'Incorrect password. ' });
    } else return cb(null, user);
  });
}
));

// session configuration
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  models.User.findById(id, function(err, user) {
    done(err, user);
  });
});

// connect passport to express via express middleware
app.use(passport.initialize());
app.use(passport.session());

app.post('/login',
passport.authenticate('local'),
function(req, res) {
  // If this function gets called, authentication was successful.
  res.json({success: true, token: req.user.id}); // `req.user` contains the authenticated user.
})

app.post('/register', function(req, res) {
  const newUser = new User({
    username: req.body.username,
    password: req.body.password
  });
  newUser.save(function(error, user) {
    if (error) res.json({success: false, error: error})
    else res.json({success: true})
  })
})

app.get('/getuser/:id', function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.send("Error: " + err)
    else res.send(user)
  })
})

app.get('/newgame/:invitee&:id', function(req, res) {
  User.find({username: req.params.invitee}, function(err, user) {
    if (user.length === 0) {
      res.send({valid: false})
    }
    else {
      User.findById(req.params.id, function(err, user2) {
        const newGame = new Game({
          winner: null,
          turn: 'White',
          completed: false,
          board: [
            ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
            ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
            ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
          ],
          takenPieces: {
            white: [],
            black: []
          },
          players: [user2.username, user[0].username],
          createdAt: new Date()
        })
        let games2 = user2.games;
        let games = user[0].games;
        newGame.save(function(err, game) {
          games2.push(game.id);
          games.push(game.id);
          User.findByIdAndUpdate(user[0].id, {games: games}, function(err, user) {
            console.log(user)
            User.findByIdAndUpdate(user2.id, {games: games2}, function(err) {
              res.send({valid: true})
            })
          })
        })
      })
    }
  })
})

app.get('/game/:id', function(req, res) {
  Game.findById(req.params.id, function(err, game) {
    res.send({game: game})
  })
})

//------------------------------------------------------------------------------
// Socket.io routes: These will all be used within the game itself
//------------------------------------------------------------------------------
io.on('connection', function(socket) {
  socket.on('makeMove', function(data) {
    Game.findOneAndUpdate(
      {id: data.id}, 
      {$set:{
        board: data.board, 
        takenPieces: data.takenPieces, 
        winner: data.winner, 
        turn: data.turn, 
        inCheck: data.inCheck, 
      }}, 
      {new: true}, 
      function(error, game) {
        io.emit('updateBoard', {game: data})
      }
    )
  })
})




server.listen(port);
