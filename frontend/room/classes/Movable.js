class Movable extends Block {
    constructor(xpos, ypos) {
        super(xpos, ypos);
    }

    update() {
        this.vx += 1;
    }
    
    display() {
        super.display();
    }

}