const uuid = require('uuid');


const games = [];
/* game object structure:
{
  id,             game id in the uuid format
  parentPlayer,   user id of parent player
  player2,        user id of second player
  field,
  currentPlayer,  player who is now making a move
  status,
}
*/


function createGame(parentID) {
  if (parentID) {
    const gameID = uuid.v4();

    games.push({
      id: gameID,
      parentPlayer: parentID,
      player2: 0,
      field: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      currentPlayer: 1,
      status: 'waiting for 2nd player',
    });

    return gameID;
  }

  return -1;
}

function getUserGames(parentID) {
  const userGames = [];
  games.forEach((g) => { if (g.parentPlayer === parentID) userGames.push(g); });
  return userGames;
}

function findGame(gameID) {
  return games.find((g) => g.id === gameID);
}

function connectToGame(gameID, user2ID) {
  const game = findGame(gameID);

  if (game) {
    if (!game.player2) {
      game.player2 = user2ID;
      game.status = 'turn of player 1';
      return 'you are connected to the game';
    }

    return 'error! this game is already busy';
  }

  return -1;
}

function getGameStatus(gameID) {
  const game = findGame(gameID);

  if (game) {
    return game.status;
  }

  return -1;
}

function getField(gameID) {
  const game = findGame(gameID);

  if (game) {
    return game.field;
  }

  return -1;
}

function setCurrentPlayer(gameID, n) {
  const game = findGame(gameID);

  game.currentPlayer = n;
  game.status = `turn of player ${n}`;
}

function getCurrentPlayer(gameID) {
  const game = findGame(gameID);

  if (game) {
    return game.currentPlayer;
  }

  return -1;
}

function changeCurrentPlayer(gameID) {
  const newPlayer = getCurrentPlayer(gameID) === 1 ? 2 : 1;
  setCurrentPlayer(gameID, newPlayer);
}

function checkForWinner(gameID) {
  const game = findGame(gameID);

  if (game) {
    const { field } = game;

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

  return -1;
}

function makeMove(gameID, userID, _x, _y) {
  const game = findGame(gameID);

  if (game) {
    let message = ''; // message shown for user

    // player 2 connected
    if (game.player2 !== 0) {
      // one of 2 players of this game is moving
      if (userID === game.parentPlayer || userID === game.player2) {
        // the current player is moving
        if ((game.currentPlayer === 1 && userID === game.parentPlayer)
        || (game.currentPlayer === 2 && userID === game.player2)) {
          // game is playing
          if (game.status !== 'game over') {
            // converting to coordinate system of array
            const x = _y - 1;
            const y = _x - 1;

            // coordinate value is valid
            if (x >= 0 && x < 3 && y >= 0 && y < 3) {
              // cell is empty
              if (!game.field[x][y]) {
                game.field[x][y] = game.currentPlayer;

                changeCurrentPlayer(gameID);

                const winner = checkForWinner(gameID);

                if (winner) { // there's a winner
                  game.status = 'game over';
                  message = `player ${winner} has won!`;
                } else { // there's no winner
                  message = 'ok';
                }
              } else {
                message = 'error! this cell is already filled';
              }
            } else {
              message = 'error! invalid value';
            }
          } else {
            message = 'error! game is already over';
          }
        } else {
          message = 'error! now is not your turn';
        }
      } else {
        message = 'error! you are not authorized for this game';
      }
    } else {
      message = 'error! player 2 did not connected';
    }

    return message;
  }

  return -1;
}

function reset(gameID, userID) {
  const game = findGame(gameID);

  if (game) {
    if (userID === game.parentPlayer || userID === game.player2) {
      game.field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
      setCurrentPlayer(gameID, 1);

      return 'game is reseted';
    }
    return 'error! you are not authorized for this game';
  }

  return -1;
}


/* functions for tests */

function clearGames() {
  games.length = 0;
}

function presetField(gameID, newField) {
  const game = findGame(gameID);

  game.field = newField;
}


module.exports = {
  createGame,
  getUserGames,
  connectToGame,
  getGameStatus,
  getField,
  setCurrentPlayer,
  getCurrentPlayer,
  checkForWinner,
  makeMove,
  reset,
  clearGames,
  presetField,
};
