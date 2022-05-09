//add the socket connection on load of the page

let socket = io();
let playerNumber = 0;
let secondPlayer = 0;

window.addEventListener("load", () => {
  socket.on("connect", () => {
    socket.on("playerConnected", (data) => {
      data.connected === 1 ? (playerNumber = 0) : (playerNumber = 1);
      data.connected === 1 ? (secondPlayer = 1) : (secondPlayer = 0);
      console.log(data);
    });
  });
});

//to work with bigger dimesnions and other computers
const maxVelocity = 20;
const wid = 1440;
const hei = 770;

const dimension = {
  blockSize: 1440 / map1[0].length,
  ground: (1440 / map1[0].length) * (map1.length - 4),
  playerSize: 50,
};

//defining all of the variables

let game;

let character2right;
let character2left;
let character1right;
let character1left;
let charactersLefts = [character1left, character2left];
let charactersRights = [character1right, character2right];

let texture;

let door_top;
let door_bottom;
let doorParts = [door_top, door_bottom];

let backGround;

function preload() {
  charactersLefts[1] = loadImage("/images/character2_left.png");
  charactersRights[1] = loadImage("/images/character2_right.png");
  charactersLefts[0] = loadImage("/images/character1_left.png");
  charactersRights[0] = loadImage("/images/character1_right.png");

  doorParts[0] = loadImage("/images/door_upper.png");
  doorParts[1] = loadImage("/images/door_lower.png");

  texture = loadImage("/images/texture.png");

  backGround = loadImage("/images/background.png");
}

socket.on("heartbeat", (players) => game && updatePlayers(players));


let play;

function updatePlayers(players) {
  game.players[0].position = players.player1;
  game.players[1].position = players.player2;

  // game.players[secondPlayer].position.x = players[secondPlayer].x;
  // game.players[secondPlayer].position.y = players[secondPlayer].y;
  // if (game.players[secondPlayer].ground !== players[secondPlayer].ground)
  //     game.players[secondPlayer].ground = players[secondPlayer].ground;
  //   if (game.players[secondPlayer].facing !== players[secondPlayer].facing)
  //     game.players[secondPlayer].facing = players[secondPlayer].facing;
}

function setup() {
  createCanvas(wid, hei);
  console.log(dimension);
  game = new Game(height, width, map1, dimension);
  // socket.on("position", (data) => {
  //   if (secondPlayer == data.player) {
  //     game.players[secondPlayer].position.x = data.x;
  //     game.players[secondPlayer].position.y = data.y;
  //     if (game.players[secondPlayer].ground !== data.ground)
  //       game.players[secondPlayer].ground = data.ground;
  //     if (game.players[secondPlayer].facing !== data.facing)
  //       game.players[secondPlayer].facing = data.facing;
  //   }
  // });
}

function draw() {
  image(backGround, 0, 0, wid, hei);
  // background(0);
  game.display();

  // let data = {
  //   player: playerNumber,
  //   x: game.players[playerNumber].position.x,
  //   y: game.players[playerNumber].position.y,
  //   ground: game.players[playerNumber].ground,
  //   facing: game.players[playerNumber].facing,
  // };

  // socket.emit("position", data);
}
