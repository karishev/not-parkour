class Key extends Block {
  constructor(xpos, ypos, size) {
    super(xpos, ypos, size);
    this.type = 2;
  }
  display() {
    image(keyImage, this.x, this.y, this.side, this.side);
  }
}
