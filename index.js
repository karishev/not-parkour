const express = require("express");
const app = express();

//creating routes by using the routes created in another file
const { routes } = require("./backend/routes");

routes.forEach((route) => {
  app.use(route.path, express.static(route.page));
});

// let Player = require("./Player");
let Game = require("./backend/game");
const { map1 } = require("./backend/map1");
//http server

const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;

console.log("Server is listenning at port 3000");

server.listen(port, () => {
  console.log("Server is listenning at port 3000");
});

//socket.io
let io = require("socket.io");

io = new io.Server(server);

//private room
let private = io.of("/private");

//all the rooms information

let rooms = {};

//room should consist of this properties:
//type room = {
//   roomNumber: number,
//   numberOfPlayers: number < 2,
//   currentLvl: number,
//   playersPositions: Object {
//     player1: x, y,
//     player2: x, y,
//   }
// }

const wid = 1440;
const hei = 770;

const dimension = {
  blockSize: 57.6,
  ground: 576,
  playerSize: 50,
};

let room = {
  numberOfPlayers: 0,
  roomNumber: 1,
  currentLvl: 1,
  players: [],
  game: new Game(hei, wid, map1, dimension),
};

setInterval(updateGame, 1000 / 60);

io.on("connection", (socket) => {
  room.numberOfPlayers++;
  // room.players.push(new Player(30, 30, socket.id));
  // room.numberOfPlayers === 1
  //   ? (room.players[0].socketID = socket.id)
  //   : (room.players[1].socketID = socket.id);

  socket.emit("playerConnected", { connected: room.numberOfPlayers });

  // socket.on("position", (data) => {
  //   room.players[data.player].x = data.x;
  //   room.players[data.player].y = data.y;
  //   room.players[data.player].facing = data.facing;
  //   room.players[data.player].ground = data.ground;
  // });

  socket.on("keyPressed", (data) => {
    if (data.key == "d" || data.key == "D") {
      room.game.players[data.player].keys.right = true;
    }
    if (data.key == "a" || data.key == "A") {
      room.game.players[data.player].keys.left = true;
    }
    if (data.key == "w" || data.key == "W") {
      room.game.players[data.player].keys.jump = true;
    }
  });

  socket.on("keyReleased", (data) => {
    if (data.key == "d" || data.key == "D") {
      room.game.players[data.player].keys.right = false;
    }
    if (data.key == "a" || data.key == "A") {
      room.game.players[data.player].keys.left = false;
    }
    if (data.key == "w" || data.key == "W") {
      room.game.players[data.player].keys.jump = false;
    }
  });

  socket.on("disconnect", () => {
    room.numberOfPlayers--;
    // io.sockets.emit("disconnect", socket.id);
    room.players = room.players.filter((player) => player.id !== socket.id);
  });
});
// console.log(room.game.players[0].ground);
function updateGame() {
  room.game.display();
  io.sockets.emit("heartbeat", {
    player1: room.game.players[0].position,
    player2: room.game.players[1].position,
  });
}
