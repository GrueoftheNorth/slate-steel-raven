var util = require("util"),
  io = require("socket.io"),
  Player = require("./Player").Player,
  express = require('express'),
  app = express();

var socket, players;

function init(){
  app.get('/', function(req,res) {
    res.sendfile('./public/index.html');
  });
  app.use(express.static('public'));

  players = [];
  socket = io.listen(app.listen(3000));
  socket.configure(function() {
    socket.set("transports", ["websocket"]);
    socket.set("log level", 2);
    setEventHandlers();
  });
};	

var setEventHandlers = function() {
  //Listens for new connections and passes them on to onSocketConnection Func.
  socket.sockets.on("connection", onSocketConnection);
};

function onSocketConnection(client) {
  util.log("New player has connected: "+ client.id);
  //client.on is an event listener which calls the following function.
  client.on("disconnect", onClientDisconnect);
  client.on("new player", onNewPlayer);
  client.on("move player", onMovePlayer);
}

function onClientDisconnect() {
  //The this refers to the client variable from onSocketConnection. Unsure why.
  util.log("Player has disconnected: " + this.id);

  var removePlayer = playerById(this.id);
  if(!removePlayer) {
    util.log("Player not found: " + this.id);
    return;
  }

  players.splice(players.indexOf(removePlayer), 1);
  this.broadcast.emit("remove player", {id: this.id});
};

function onNewPlayer(data) {
  var newPlayer = new Player(data.x, data.y);
  newPlayer.id = this.id;
  //Send new player to those previously connected
  this.broadcast.emit("new player", {id: newPlayer.id, x: newPlayer.getX(), y: newPlayer.getY()});
  
  //Send existing players to new player.
  var i, existingPlayer;
  for(i = 0; i < players.length; i++) {
    existingPlayer = players[i];
    this.emit("new player", {id: existingPlayer.id, x: existingPlayer.getX(), y: existingPlayer.getY()});
  }

  players.push(newPlayer);
};

function onMovePlayer(data){
  var movePlayer = playerById(this.id);
  if(!movePlayer){
          util.log("Player not found: Move : " + data.id);
          return;
  }

  movePlayer.setX(data.x);
  movePlayer.setY(data.y);
  this.broadcast.emit("move player", {id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY()});
};

function playerById(id){
  var i;
  for(i = 0; i < players.length; i++){
    if(players[i].id == id)
      return players[i];
  }
  return false;
};

init();
