class Block {
  constructor(xpos, ypos, size, row, col) {
    this.x = xpos;
    this.y = ypos;
    this.type = 0;
    this.row = row;
    this.col = col;
    this.vx = 0;
    this.vy = 0;
    this.side = size;
  }
  display() {
    this.x += this.vx;
    this.y += this.vy;

    // image(texture, this.x, this.y, this.side, this.side);
    // noStroke();
    // fill(0);
    // square(this.x, this.y, this.side);
  }
}

module.exports = Block;
