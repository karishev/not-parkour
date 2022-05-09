let { map1 } = require("../map1");

function createVector(x, y) {
  return {
    x: x,
    y: y,
  };
}

function map(number, inMin, inMax, outMin, outMax) {
  return ((number - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
}

//all the neede dvariabled for the player class
class Player {
  constructor(xpos, ypos, size, ground, num, second, blocks) {
    this.position = createVector(xpos, ypos);
    this.prevPosition = createVector(0, 0);
    this.velocity = createVector(0, 0);
    this.gravity = 0.6;
    this.movement_speed = 5.5;
    this.jump_speed = num == 1 ? 11 : 9;
    this.side = size;
    this.highestPoint = ground;
    this.keys = { right: false, left: false, jump: false };
    this.facing = "right";
    this.ground = ground;
    this.onGround = false;
    this.num = num;
    this.second = second;
    this.blocks = blocks;
    this.key = false;
  }

  //applying the gravity all the time if the player is not on the ground
  applyGravity() {
    if (!this.onGround) {
      this.velocity.y =
        this.velocity.y + this.gravity < 20
          ? this.velocity.y + this.gravity
          : 20;
    }

    let second = this.second;

    //checking if the player one is on top of the other player and then the trampoline ability starts to work
    if (
      this.ground == second.position.y &&
      this.position.y + this.side >= second.position.y &&
      this.position.x + this.side >= second.position.x &&
      this.position.x <= second.position.x + second.side &&
      second.num == 0
    ) {
      let jumpVal = parseInt(
        map(second.position.y + this.side - this.highestPoint, 0, 500, 6, 22)
      );
      //   console.log(second.position.y + this.side, this.highestPoint)
      //   console.log(
      //     parseInt(
      //       map(second.position.y + this.side - this.highestPoint, 0, 600, 0, 32)
      //     )
      //   );
      this.jump(jumpVal);
      this.highestPoint = this.ground;
    } else if (this.position.y + this.side >= this.ground) {
      this.position.y = this.ground - this.side;
      this.onGround = true;
      this.highestPoint = this.ground;
      this.velocity.y = 0;
    } else {
      if (this.position.y + this.side < this.highestPoint) {
        this.highestPoint = this.position.y + this.side;
      }
      this.onGround = false;
    }
  }

  //giving the directions of the jump based on the keys pressed
  jump(speed) {
    if (this.keys.left) {
      this.velocity = createVector(-this.movement_speed, -speed);
      this.facing = "left";
    } else if (this.keys.right) {
      this.velocity = createVector(this.movement_speed, -speed);
      this.facing = "right";
    } else {
      this.velocity = createVector(0, -speed);
    }
    this.onGround = false;
  }

  //checking the horizontal collisions
  checkCollisions() {
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];

      //10 is for skipping and not displaying
      if (block.type === 10) continue;

      // up
      if (
        this.position.x + this.side > block.x &&
        this.position.x < block.x + block.side &&
        this.position.y <= block.y + block.side &&
        this.position.y > block.y + block.side / 2 &&
        !this.onGround &&
        this.velocity.y < 0
      ) {
        this.position.y = block.y + block.side;
        this.velocity.y = 0;
      }

      // right
      else if (
        this.position.x + this.side >= block.x &&
        this.position.x <= block.x - this.side / 4 &&
        this.position.y + this.side > block.y &&
        this.position.y < block.y + block.side
      ) {
        this.position.x = block.x - this.side;
        if (block.row - 1 >= 0 && map1[block.row - 1][block.col] == 1) {
          this.velocity.x = 0;
        }
        //checking if we touch the key
        if (block.type == 2) {
          this.key = true;
          block.type = 10;
        }

        // left
      } else if (
        this.position.x <= block.x + block.side &&
        this.position.x > block.x + block.side / 4 &&
        this.position.y + this.side > block.y &&
        this.position.y < block.y + block.side
      ) {
        this.position.x = block.x + block.side;
        if (block.row - 1 >= 0 && map1[block.row - 1][block.col] == 1) {
          this.velocity.x = 0;
        }
        //checking if we touch the key
        if (block.type == 2) {
          this.key = true;
          block.type = 10;
        }
      }
    }
  }

  findGround() {
    this.applyGravity();
    for (let i = 0; i < this.blocks.length; i++) {
      const block = this.blocks[i];
      //10 is for skipping and not displaying
      if (block.type === 10) continue;
      if (
        this.position.x + this.side > block.x &&
        this.position.x < block.x + block.side &&
        this.position.y + this.side <= block.y
      ) {
        this.ground = block.y;
        break;
      } else {
        this.ground = 576;
      }
    }

    let second = this.second;
    if (
      this.position.y + this.side <= second.position.y &&
      this.position.x + this.side > second.position.x &&
      this.position.x < second.position.x + second.side
    ) {
      if (this.ground >= second.position.y) {
        this.ground = second.position.y;
      }
    }
  }

  update() {
    this.findGround();
    this.checkCollisions();

    if (
      this.keys.right &&
      this.position.x + this.side < 1440 &&
      this.onGround
    ) {
      this.velocity.x = this.movement_speed;
      this.facing = "right";
    } else if (this.keys.left && this.position.x > 0 && this.onGround) {
      this.velocity.x = -this.movement_speed;
      this.facing = "left";
    } else if (!this.keys.left && !this.keys.right)
      // && this.onGround
      this.velocity.x = 0;

    //vertical movement
    if (this.keys.jump && this.onGround) {
      this.prevPosition = createVector(this.position.x, this.position.y);
      this.jump(this.jump_speed);
    }

    // this.position.add(this.velocity);
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }

  display() {
    this.update();
  }
}

module.exports = Player;
