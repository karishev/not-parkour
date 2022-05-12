class Door extends Block {
  constructor(xpos, ypos, size, part) {
    super(xpos, ypos, size);
    this.type = 3;
    this.part = part;
    this.opened = false;
  }

  // update() {
  //     this.vx += 1;
  // }

  display() {
    if (this.type == 25) {
      image(doorOpenParts[this.part], this.x, this.y, this.side, this.side);
    } else image(doorParts[this.part], this.x, this.y, this.side, this.side);
  }
}
