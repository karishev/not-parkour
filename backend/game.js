function createVector(x, y) {
  return {
    x: x,
    y: y,
  };
}

let Player = require("./Player");
let Block = require("./Block");
let Door = require("./Door");

class Game {
  constructor(h, w, map, dimension) {
    // this.g = (h / 3) * 2;
    this.size = 57.6;
    this.g = 576;
    this.h = h;
    this.w = w;
    this.players = [
      new Player(30, 30, 50, 576, 0),
      new Player(30, 30, 50, 576, 1),
    ];
    this.blocks = this.initializeMap(map);
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
        } else if (item == 9) {
          let pos = createVector(col * this.size, row * this.size);
          this.players[1].position = pos;
        } else if (item == 3) {
          dummy.push(new Door(col * this.size, row * this.size, this.size, 0));
          dummy.push(
            new Door(col * this.size, (row + 1) * this.size, this.size, 1)
          );
        }
      }
    }
    this.players[0].blocks = dummy;
    this.players[1].blocks = dummy;
    return dummy;
  }

  //displaying all the game elements
  display() {
    this.players[0].second = this.players[1];
    this.players[1].second = this.players[0];
    this.blocks.forEach((block) => {
      block.display();
    });

    this.players.forEach((player) => {
      player.display();
    });
    // fill(200);
    // noStroke();
    // rect(0, this.g, this.w, this.h - this.g);
  }
}

module.exports = Game;
