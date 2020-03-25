let field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
let currentPlayer = 1;

function getField() {
  return field;
}

function setCurrentPlayer(n) {
  currentPlayer = n;
}

function getCurrentPlayer() {
  return currentPlayer;
}

function changeCurrentPlayer() {
  const newPlayer = getCurrentPlayer() === 1 ? 2 : 1;
  setCurrentPlayer(newPlayer);
}

function checkForWinner() {
  // horizontals
  for (let r = 0; r < 3; r += 1) {
    if (field[r][0] === field[r][1] && field[r][1] === field[r][2] && field[r][0] !== 0) {
      return field[r][0];
    }
  }

  // verticals
  for (let c = 0; c < 3; c += 1) {
    if (field[0][c] === field[1][c] && field[1][c] === field[2][c] && field[0][c] !== 0) {
      return field[0][c];
    }
  }

  // diagonals
  if (field[1][1] !== 0) {
    if ((field[0][0] === field[1][1] && field[1][1] === field[2][2])
        || (field[2][0] === field[1][1] && field[1][1] === field[0][2])) {
      return field[0][0];
    }
  }

  return false;
}

function makeMove(_x, _y) {
  let message = ''; // message shown for user

  // converting to coordinate system of array
  const x = _y - 1;
  const y = _x - 1;

  // coordinate value is valid
  if (x >= 0 && x < 3 && y >= 0 && y < 3) {
    if (!field[x][y]) { // cell is empty
      field[x][y] = currentPlayer;

      changeCurrentPlayer();

      const winner = checkForWinner();

      if (winner) { // there's a winner
        message = `player ${winner} has won!`;
      } else { // there's no winner
        message = 'ok';
      }
    } else { // cell isn't empty
      message = 'this cell is already filled';
    }
  } else { // coordinate value is invalid
    message = 'invalid value';
  }

  return message;
}

function reset() {
  field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  setCurrentPlayer(1);
}

function presetField(newField) {
  field = newField;
}


module.exports = {
  getField,
  setCurrentPlayer,
  getCurrentPlayer,
  checkForWinner,
  makeMove,
  reset,
  presetField,
};
