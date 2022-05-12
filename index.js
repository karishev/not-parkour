const express = require("express");
const app = express();

//creating routes by using the routes created in another file
const { routes } = require("./backend/routes");

routes.forEach((route) => {
  app.use(route.path, express.static(route.page));
});

// let Player = require("./Player");
let Game = require("./backend/classes/game");
// const { map1 } = require("./backend/map1");
const { maps } = require("./backend/maps");
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
let roomSocket = io.of("/room");
let serverSocket = io.of("/servers");

//all the rooms information

let rooms = {};
let dataRooms = {};

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

// let room = {
//   numberOfPlayers: 0,
//   roomNumber: 1,
//   currentLvl: 1,
//   players: [],
//   game: new Game(hei, wid, map1),
// };

let interval;

//Listen for users connecting to main page
io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);

  socket.on("checkRoom", (data) => {
    if (socket.id == data.id) {
      console.log(data);
      if (rooms[data.room] != null && rooms[data.room].numberOfPlayers < 2) {
        io.to(data.id).emit("checkedRoom", { create: "yes" });
      } else if (
        rooms[data.room] != null &&
        rooms[data.room].numberOfPlayers == 2
      ) {
        io.to(data.id).emit("checkedRoom", { create: "full" });
      } else {
        io.to(data.id).emit("checkedRoom", { create: "no" });
      }
    }
  });

  socket.on("creatingRoom", (data) => {
    if (socket.id == data.id) {
      console.log(data);
      if (rooms[data.room] != null) {
        io.to(data.id).emit("createdRoom", { create: "no" });
      } else {
        io.to(data.id).emit("createdRoom", { create: "yes" });
        rooms[data.room] = {
          numberOfPlayers: 0,
          roomNumber: data.room,
          currentLvl: 1,
          players: [],
          game: new Game(hei, wid, maps),
        };
        dataRooms[data.room] = true;
        interval = setInterval(() => {
          updateGame(data.room);
        }, 1000 / 60);
      }
    }
  });

  //Listen for this client to disconnect
  socket.on("disconnect", function () {
    console.log("A client has disconnected: " + socket.id);
  });
});

roomSocket.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);
  if (socket.room && rooms[socket.room] == null) {
    roomSocket.in(socket.room).emit("roomEnded");
  } else if (rooms[socket.room]) rooms[socket.room].numberOfPlayers++;
  socket.on("room", function (data) {
    let roomName = data.room;
    //Add this socket to the room
    socket.join(roomName);
    //Add a room property to the individual socket
    socket.room = roomName;
    if (rooms[socket.room] == null) {
      roomSocket.in(data.room).emit("roomEnded");
      clearInterval(interval);
    } else {
      rooms[socket.room].numberOfPlayers++;
      if (rooms[socket.room].numberOfPlayers == 2) {
        console.log("yes");
        delete dataRooms[socket.room];
      }
      roomSocket.to(socket.id).emit("playerConnected", {
        connected: rooms[socket.room].numberOfPlayers,
      });
    }
  });

  socket.on("keyPressed", (data) => {
    // console.log(rooms[socket.room].game.players[0].position);
    if (data.key == "d" || data.key == "D" || data.key == "ArrowRight") {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.right = true)
        : console.log("no room");
    }
    if (data.key == "a" || data.key == "A" || data.key == "ArrowLeft") {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.left = true)
        : console.log("no room");
    }
    if (
      data.key == "w" ||
      data.key == "W" ||
      data.key == "ArrowUp" ||
      data.key == " "
    ) {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.jump = true)
        : console.log("no room");
    }
  });

  socket.on("keyReleased", (data) => {
    if (data.key == "d" || data.key == "D" || data.key == "ArrowRight") {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.right = false)
        : console.log("no room");
    }
    if (data.key == "a" || data.key == "A" || data.key == "ArrowLeft") {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.left = false)
        : console.log("no room");
    }
    if (
      data.key == "w" ||
      data.key == "W" ||
      data.key == "ArrowUp" ||
      data.key == " "
    ) {
      rooms[socket.room]
        ? (rooms[socket.room].game.players[data.player].keys.jump = false)
        : console.log("no room");
    }
  });

  socket.on("restart", () => {
    roomSocket.in(socket.room).emit("restart");
    rooms[socket.room].game.reset();
  });

  socket.on("disconnect", () => {
    rooms[socket.room] && rooms[socket.room].numberOfPlayers--;
    rooms[socket.room]
      ? (rooms[socket.room].players = rooms[socket.room].players.filter(
          (player) => player.id !== socket.id
        ))
      : "";
    delete rooms[socket.room];
    delete dataRooms[socket.room];

    // io.sockets.emit("disconnect", socket.id);
    roomSocket.in(socket.room).emit("roomEnded", { ended: true });
    clearInterval(interval);
  });
});
// console.log(room.game.players[0].ground);
function updateGame(roomName) {
  rooms[roomName] &&
    roomSocket.in(roomName).emit("heartbeat", {
      player1: {
        pos: rooms[roomName].game.players[0].position,
        facing: rooms[roomName].game.players[0].facing,
        jumped: rooms[roomName].game.players[0].jumped,
      },
      player2: {
        pos: rooms[roomName].game.players[1].position,
        facing: rooms[roomName].game.players[1].facing,
        jumped: rooms[roomName].game.players[1].jumped,
      },
      key: rooms[roomName].game.key,
      lvl: rooms[roomName].game.currentMap,
      end: rooms[roomName].game.gameEnded,
      num: rooms[roomName].numberOfPlayers,
    });

  rooms[roomName] && rooms[roomName].game.display();
}

let serverInterval;
serverSocket.on("connection", (socket) => {
  serverSocket.to(socket.id).emit("servers", dataRooms);

  serverInterval = setInterval(() => {
    serversData(socket.id);
  }, 3000);

  socket.on("disconnect", () => {
    clearInterval(serverInterval);
  });
});

function serversData(id) {
  serverSocket.to(id).emit("servers", dataRooms);
  console.log(dataRooms);
}
