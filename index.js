const express = require("express");
const app = express();

//creating routes by using the routes created in another file

app.use("/", express.static("frontend"));

//http server

const http = require("http");
const server = http.createServer(app);
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("Server is listenning at port 3000");
});

//socket.io
let io = require("socket.io");

io = new io.Server(server);

//private room
// let private = io.of("/private");

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

let room = {
  numberOfPlayers: 0,
  roomNumber: 1,
  currentLvl: 1,
  players: [
    {
      x: 30,
      y: 30,
      socketID: null,
    },
    {
      x: 30,
      y: 30,
      socketID: null,
    },
  ],
};

io.on("connection", (socket) => {
  room.numberOfPlayers++;
  room.numberOfPlayers === 1
    ? (room.players[0].socketID = socket.id)
    : (room.players[1].socketID = socket.id);

  socket.emit("playerConnected", { connected: room.numberOfPlayers });

  socket.on("position", (data) => {
    room.players[data.player].x = data.x;
    room.players[data.player].y = data.y;

    io.emit("position", data);
  });

  socket.on("disconnect", () => {
    room.numberOfPlayers--;
  });
});
