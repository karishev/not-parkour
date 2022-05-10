function createVector(x, y) {
  return {
    x: x,
    y: y,
  };
}

let Player = require("./Player");
let Block = require("./Block");
let Door = require("./Door");
let Key = require("./Key");
let Removable = require("./Removable");

class Game {
  constructor(h, w, maps) {
    // this.g = (h / 3) * 2;
    this.size = 57.6;
    this.g = 576;
    this.h = h;
    this.w = w;
    this.maps = maps;
    this.players = [
      new Player(30, 30, 50, 576, 0),
      new Player(30, 30, 50, 576, 1),
    ];
    this.currentMap = 0;
    this.blocks = this.initializeMap(maps[this.currentMap]);
    this.key = false;
    this.lvlFinished = false;
    this.gameEnded = false;
  }

  //initializing the blocks into the array given the number in the map
  initializeMap(given) {
    let dummy = [];
    for (let row = 0; row < given.length; row++) {
      for (let col = 0; col < given[row].length; col++) {
        const item = given[row][col];
        if (item == 1)
          dummy.push(
            new Block(col * this.size, row * this.size, this.size, row, col)
          );
        else if (item == 8) {
          let pos = createVector(col * this.size, row * this.size);
          this.players[0].position = pos;
          this.players[0].map = this.maps[this.currentMap];
        } else if (item == 9) {
          let pos = createVector(col * this.size, row * this.size);
          this.players[1].position = pos;
          this.players[1].map = this.maps[this.currentMap];
        } else if (item == 3) {
          dummy.push(new Door(col * this.size, row * this.size, this.size, 0));
          dummy.push(
            new Door(col * this.size, (row + 1) * this.size, this.size, 1)
          );
        } else if (item == 2) {
          dummy.push(new Key(col * this.size, row * this.size, this.size));
        } else if (item == 4) {
          dummy.push(
            new Removable(col * this.size, row * this.size, this.size)
          );
        }
      }
    }
    this.players[0].blocks = dummy;
    this.players[1].blocks = dummy;
    return dummy;
  }

  reset() {
    this.blocks = this.initializeMap(this.maps[this.currentMap]);
    this.key = false;
    this.lvlFinished = false;
    this.players[0].key = false;
    this.players[1].key = false;
    this.players[0].indoor = false;
    this.players[1].indoor = false;
  }

  update() {
    this.players[0].second = this.players[1];
    this.players[1].second = this.players[0];

    //checking whether the key is in touched already
    this.key = this.players[0].key || this.players[1].key;
    this.lvlFinished = this.players[0].indoor && this.players[1].indoor;

    if (this.lvlFinished) {
      this.currentMap += 1;
      if (this.currentMap >= this.maps.length) {
        this.gameEnded = true;
      } else this.reset();
    }
  }

  //displaying all the game elements
  display() {
    !this.gameEnded && this.update();

    this.blocks.forEach((block) => {
      if (block.type == 2 && this.key) block.type = 10;
      else if (block.type == 3 && this.key) block.type = 11;
      else if (block.type == 4 && this.key) block.type = 10;
      else if (block.type != 10) block.display();
    });

    this.players.forEach((player) => {
      player.display();
    });
  }
}

module.exports = Game;
