let Block = require("./Block");

class Door extends Block {
  constructor(xpos, ypos, size, part) {
    super(xpos, ypos, size);
    this.type = 3;
    this.part = part;
  }

  // update() {
  //     this.vx += 1;
  // }

  display() {
    // image(doorParts[this.part], this.x, this.y, this.side, this.side);
  }
}

module.exports = Door;
