const express = require("express");
const app = express();

//creating routes by using the routes created in another file
const { routes } = require("./backend/routes");

routes.forEach((route) => {
  app.use(route.path, express.static(route.page));
});

// let Player = require("./Player");
let Game = require("./backend/classes/game");
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
let roomSocket = io.of("/room");

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

// const dimension = {
//   blockSize: 57.6,
//   ground: 576,
//   playerSize: 50,
// };

// let room = {
//   numberOfPlayers: 0,
//   roomNumber: 1,
//   currentLvl: 1,
//   players: [],
//   game: new Game(hei, wid, map1),
// };

//Listen for users connecting to main page
io.on("connection", (socket) => {
  console.log("We have a new client: " + socket.id);

  socket.on("checkRoom", (data) => {
    if (socket.id == data.id) {
      console.log(data);
      if (rooms[data.room] != null && rooms[data.room].numberOfPlayers < 2) {
        io.to(data.id).emit("checkedRoom", { create: "yes" });
        // rooms[data.room].push({ id: data.id });
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
          numberOfPlayers: 1,
          roomNumber: data.room,
          currentLvl: 1,
          players: [],
          game: new Game(hei, wid, map1),
        };
      }
    }
  });

  //Listen for this client to disconnect
  socket.on("disconnect", function () {
    console.log("A client has disconnected: " + socket.id);
  });
});
let interval;
roomSocket.on("connection", (socket) => {
  // room.players.push(new Player(30, 30, socket.id));
  // room.numberOfPlayers === 1
  //   ? (room.players[0].socketID = socket.id)
  //   : (room.players[1].socketID = socket.id);

  console.log("We have a new client: " + socket.id);
  if (rooms[socket.room] == null)
    rooms[socket.room] = {
      numberOfPlayers: 1,
      roomNumber: socket.room,
      currentLvl: 1,
      players: [],
      game: new Game(hei, wid, map1),
    };
  interval = setInterval(() => {
    updateGame(socket.room);
  }, 1000 / 60);

  socket.on("room", function (data) {
    console.log("room");
    let roomName = data.room;
    //Add this socket to the room
    socket.join(roomName);
    //Add a room property to the individual socket
    socket.room = roomName;
    if (rooms[socket.room] == null)
      rooms[socket.room] = {
        numberOfPlayers: 1,
        roomNumber: data.room,
        currentLvl: 1,
        players: [],
        game: new Game(hei, wid, map1),
      };
    else rooms[socket.room].numberOfPlayers++;
    //Let everyone in the room know that a new user has joined
    // let joinMsg = "A new user has joined the chat room: " + roomName;

    roomSocket.to(socket.id).emit("playerConnected", {
      connected: rooms[socket.room].numberOfPlayers,
    });
  });

  socket.on("keyPressed", (data) => {
    // console.log(rooms[socket.room].game.players[0].position);
    if (data.key == "d" || data.key == "D") {
      rooms[socket.room].game.players[data.player].keys.right = true;
    }
    if (data.key == "a" || data.key == "A") {
      rooms[socket.room].game.players[data.player].keys.left = true;
    }
    if (data.key == "w" || data.key == "W") {
      rooms[socket.room].game.players[data.player].keys.jump = true;
    }
  });

  socket.on("keyReleased", (data) => {
    if (data.key == "d" || data.key == "D") {
      rooms[socket.room].game.players[data.player].keys.right = false;
    }
    if (data.key == "a" || data.key == "A") {
      rooms[socket.room].game.players[data.player].keys.left = false;
    }
    if (data.key == "w" || data.key == "W") {
      rooms[socket.room].game.players[data.player].keys.jump = false;
    }
  });

  socket.on("disconnect", () => {
    rooms[socket.room].numberOfPlayers--;
    // io.sockets.emit("disconnect", socket.id);
    rooms[socket.room].players = rooms[socket.room].players.filter(
      (player) => player.id !== socket.id
    );
    clearInterval(interval);
  });
});
// console.log(room.game.players[0].ground);
function updateGame(roomName) {
  roomSocket.in(roomName).emit("heartbeat", {
    player1: {
      pos: rooms[roomName].game.players[0].position,
      facing: rooms[roomName].game.players[0].facing,
    },
    player2: {
      pos: rooms[roomName].game.players[1].position,
      facing: rooms[roomName].game.players[1].facing,
    },
    key: rooms[roomName].game.key,
  });
  rooms[roomName].game.display();
}
