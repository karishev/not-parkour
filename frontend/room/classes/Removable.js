class Removable extends Block {
  constructor(xpos, ypos, size) {
    super(xpos, ypos, size);
    this.type = 4;
  }

  display() {
    if (this.type == 4) super.display();
  }
}
