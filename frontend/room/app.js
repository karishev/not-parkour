//functions for the pause

function openPause() {
  pauseDisplay = document.getElementById("popup__menu");
  clickSound.play();

  if (pauseDisplay.style.display == "none") {
    pauseDisplay.style.display = "block";
  } else if ((pauseDisplay.style.display = "block")) {
    pauseDisplay.style.display = "none";
  }
}

function closePause() {
  clickSound.play();
  pauseDisplay = document.getElementById("popup__menu");
  pauseDisplay.style.display = "none";
}

function restartGame() {
  clickSound.play();
  socket.emit("restart");
  pauseDisplay = document.getElementById("popup__menu");
  pauseDisplay.style.display = "none";
  // game.reset();
}

function mainMenu() {
  clickSound.play();
  let loc = String(window.location.href);
  window.location.href = loc.slice(0, loc.indexOf("room"));
  // window.location.href = "/";
}

function displayInstructions() {
  clickSound.play();
  instructions = document.getElementById("popup__image");
  if (instructions.style.display == "none") {
    instructions.style.display = "block";
  } else if ((instructions.style.display = "block")) {
    instructions.style.display = "none";
  }
}

//add the socket connection on load of the page

let socket = io("/room");
let playerNumber = -1;
let secondPlayer = -1;

window.addEventListener("load", () => {
  socket.on("connect", () => {
    socket.on("roomEnded", () => {
      let loc = String(window.location.href);
      window.location.href = loc.slice(0, loc.indexOf("room"));
      //one of the players disconnected, therefore, the game ended and now we need to get out of the room
    });
    roomNumber = sessionStorage.getItem("room");
    socket.emit("room", { room: roomNumber });
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
let door_open_top;
let door_open_bottom;
let doorOpenParts = [door_open_top, door_open_bottom];

let doorOpen;

let keyImage;

let backGround;

let mainFont;
let waitingText;
let musicOn;
let musicOff;

let pause;

let song;
let doorOpenedSound;
let clickSound;
let mushroomJump;
let winSound;

let winscreen;
let returnBtn;

function preload() {
  charactersLefts[1] = loadImage("/room/images/character2_left.png");
  charactersRights[1] = loadImage("/room/images/character2_right.png");
  charactersLefts[0] = loadImage("/room/images/character1_left.png");
  charactersRights[0] = loadImage("/room/images/character1_right.png");

  doorParts[0] = loadImage("/room/images/door_upper.png");
  doorParts[1] = loadImage("/room/images/door_lower.png");

  doorOpenParts[0] = loadImage("/room/images/door__open__upper.png");
  doorOpenParts[1] = loadImage("/room/images/door__open__lower.png");

  doorOpen = loadImage("/room/images/door_open.png");

  texture = loadImage("/room/images/texture.png");

  keyImage = loadImage("/room/images/key.png");

  backGround = loadImage("/room/images/background.png");

  mainFont = loadImage("/room/images/you.png");
  waitingText = loadImage("/room/images/waiting__text.png");

  musicOn = loadImage("/room/images/music__on.png");
  musicOff = loadImage("/room/images/music__off.png");

  pause = loadImage("/room/images/pause.png");
  song = loadSound("/room/sounds/menu__music.mp3");

  doorOpenedSound = loadSound("/room/sounds/door.mp3");
  clickSound = loadSound("/room/sounds/click.mp3");
  mushroomJump = loadSound("/room/sounds/jump__mushroom.mp3");
  woodJump = loadSound("/room/sounds/jump__wood.mp3");
  winSound = loadSound("/room/sounds/win.mp3");

  winscreen = loadImage("/room/images/win__window.png");
  returnBtn = loadImage("/room/images/return.png");
}

socket.on("heartbeat", (players) => game && updatePlayers(players));

let count = 0;

function updatePlayers(players) {
  game.players[0].position = players.player1.pos;
  game.players[0].facing = players.player1.facing;
  game.players[1].position = players.player2.pos;
  game.players[1].facing = players.player2.facing;

  if (game.players[0].jumped != players.player1.jumped) {
    mushroomJump.play();
  }
  if (game.players[1].jumped != players.player2.jumped) {
    woodJump.play();
  }
  game.players[0].jumped = players.player1.jumped;
  game.players[1].jumped = players.player2.jumped;

  if (game.key !== players.key) {
    doorOpenedSound.play();
  }
  game.key = players.key;
  if (game.currentLvl != players.lvl) {
    game.currentLvl = players.lvl;
    game.reset();
  }
  if (players.end && count == 0) {
    game.won = true;
    winSound.play();
    count++;
  }
  if (!game.started && players.num == 2) {
    let damn = setTimeout(() => {
      game.started = true;
    }, 2000);
  }
}

function setup() {
  song.setVolume(0.5);
  song.loop();
  createCanvas(wid, hei);
  console.log(dimension);
  game = new Game(height, width, maps, dimension);
  socket.on("heartbeat", (players) => game && updatePlayers(players));

  socket.on("restart", () => {
    game.reset();
  });

  //if the room ends of one of the players disconnects we move them back to the main menu,
  //since it would be impossible to reconnect to the room
  socket.on("roomEnded", () => {
    let loc = String(window.location.href);
    window.location.href = loc.slice(0, loc.indexOf("room"));
    //one of the players disconnected, therefore, the game ended and now we need to get out of the room
  });

  socket.on("disconnect", () => {
    let loc = String(window.location.href);
    window.location.href = loc.slice(0, loc.indexOf("room"));
  });
}

function draw() {
  image(backGround, 0, 0, wid, hei);
  game.display();
}

function mousePressed() {
  if (
    mouseX >= 1324 &&
    mouseX <= 1324 + 48 &&
    mouseY >= 68 &&
    mouseY <= 68 + 48
  ) {
    openPause();
    clickSound.play();
  }
  if (
    mouseX >= 1270 &&
    mouseX <= 1270 + 48 &&
    mouseY >= 68 &&
    mouseY <= 68 + 48
  ) {
    clickSound.play();
    game.music = !game.music;
    !game.music && song.setVolume(0);
    game.music && song.setVolume(0.5);
  }

  if (
    mouseX >= 300 &&
    mouseX <= 450 &&
    mouseY >= 250 &&
    mouseY <= 400 &&
    game.won
  ) {
    mainMenu();
  }

  // 1324.8 67.6 47.6 47.6
}
