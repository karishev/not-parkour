function keyPressed() {
  switch (keyCode) {
    case LEFT_ARROW:
      game.players[playerNumber].keys.left = true;
      break;
    case RIGHT_ARROW:
      game.players[playerNumber].keys.right = true;
      break;
    default:
      break
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
  switch (keyCode) {
    case LEFT_ARROW:
      game.players[playerNumber].keys.left = false;
      break;
    case RIGHT_ARROW:
      game.players[playerNumber].keys.right = false;
      break;
    default:
      break
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
