class Game {
  constructor(h, w, maps, dimension) {
    // this.g = (h / 3) * 2;
    this.size = dimension.blockSize;
    this.g = dimension.ground;
    this.h = h;
    this.w = w;
    this.players = [
      new Player(30, 30, dimension.playerSize, dimension.ground, 0),
      new Player(30, 30, dimension.playerSize, dimension.ground, 1),
    ];
    this.blocks = this.initializeMap(maps[0]);
    this.key = false;
    this.started = false; //
    this.maps = maps;
    this.currentLvl = 0;
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
        } else if (item == 2) {
          dummy.push(new Key(col * this.size, row * this.size, this.size));
        } else if (item == 4) {
          dummy.push(
            new Removable(col * this.size, row * this.size, this.size)
          );
        }
      }
    }

    return dummy;
  }

  //waiting for players screen
  waiting() {
    let num = 70;
    fill(255);
    square(num, num, (wid - num * 4) / 2);
    square((wid - num * 2) / 2 + num * 2, num, (wid - num * 4) / 2);
    image(
      charactersRights[0],
      num * 3,
      num * 3,
      (wid - num * 12) / 2,
      (wid - num * 12) / 2
    );
    image(
      charactersLefts[1],
      (wid - num * 6) / 2 + num * 6,
      num * 3,
      (wid - num * 12) / 2,
      (wid - num * 12) / 2
    );

    playerNumber == 0
      ? image(mainFont, num * 4, num * 8, num * 2, num)
      : image(mainFont, wid - num * 6, num * 8, num * 2, num);
  }

  reset() {
    this.blocks = this.initializeMap(this.maps[this.currentLvl]);
    this.key = false;
    this.lvlFinished = false;
  }

  //displaying all the game elements
  display() {
    !this.started && this.waiting();

    this.started &&
      this.players.forEach((player) => {
        player.display();
      });

    this.started &&
      this.blocks.forEach((block) => {
        if (block.type == 2 && this.key) block.type = 10;
        else if (block.type == 3 && this.key) block.type = 25;
        else if (block.type == 4 && this.key) block.type = 10;
        else if (block.type != 10) block.display();
      });
  }
}
