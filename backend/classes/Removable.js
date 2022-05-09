let Block = require("./Block");

class Removable extends Block {
  constructor(xpos, ypos, size, part) {
    super(xpos, ypos, size);
    this.type = 4;
  }

  // update() {
  //     this.vx += 1;
  // }

  display() {
  }
}


module.exports = Removable;