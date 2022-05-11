function keyPressed() {
  
  game.started && socket.emit("keyPressed", { player: playerNumber, key: key });
  switch (keyCode) {
    case LEFT_ARROW:
      game.players[playerNumber].keys.left = true;
      break;
    case RIGHT_ARROW:
      game.players[playerNumber].keys.right = true;
      break;
    case BACKSPACE:
      break;
    default:
      break;
  }
  if (key == "d" || key == "D") {
    game.players[playerNumber].keys.right = true;
  }
  if (key == "a" || key == "A") {
    game.players[playerNumber].keys.left = true;
  }
  if (key == "w" || key == "W") {
    game.players[playerNumber].keys.jump = true;
  }

  // socket.emit("position", {
  //   x: game.players[playerNumber].x,
  //   y: game.players[playerNumber].y,
  // });
}

function keyReleased() {
  game.started &&
    socket.emit("keyReleased", { player: playerNumber, key: key });
  switch (keyCode) {
    case LEFT_ARROW:
      game.players[playerNumber].keys.left = false;
      break;
    case RIGHT_ARROW:
      game.players[playerNumber].keys.right = false;
      break;
    default:
      break;
  }
  if (key == "d" || key == "D") {
    game.players[playerNumber].keys.right = false;
  }
  if (key == "a" || key == "A") {
    game.players[playerNumber].keys.left = false;
  }
  if (key == "w" || key == "W") {
    game.players[playerNumber].keys.jump = false;
  }
}
