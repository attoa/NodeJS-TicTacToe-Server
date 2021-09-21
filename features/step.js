const { Given, Then } = require('cucumber');
const request = require('supertest');
const assert = require('assert');
const controller = require('../src/game');
const app = require('../src/server');
const users = require('../src/lib/users');


let lastResult = {};
let sessionID1 = '';
let sessionID2 = '';
let gameID = '';


/* Регистрация и авторизация */

Given('отсутвует пользователь с именем {string} и паролем {string}', (string1, string2) => {
  assert.equal(undefined, users.checkExisting(string1, string2));
});

Given('регистрируется пользователь с именем {string} и паролем {string}', (string1, string2) => {
  users.registerUser(string1, string2);
});

Then('есть пользователь с именем {string} и паролем {string}', (string1, string2) => {
  users.checkExisting(string1, string2);
});

Given('пустой массив сессий', () => {
  users.clearSessions();
});

Given('авторизуется пользователь с именем {string} и паролем {string}', (string1, string2) => {
  sessionID1 = users.loginUser(string1, string2);
});

Then('возвращается id сессии', () => {
  assert.notEqual(-1, sessionID1);
});

Then('есть сессия с данным id сессии', () => {
  assert.notEqual(-1, users.checkSession(sessionID1));
});


/* Создание новой игры и получение списка игр */

Given('пользователь создает новую игру', () => {
  const userID = users.checkSession(sessionID1).id;
  gameID = controller.createGame(userID);
});

Then('возвращается id игры', () => {
  assert.notEqual(-1, gameID);
});

Given('пустой массив игр', () => {
  controller.clearGames();
});

Then('количество игр равно {int}', (int) => {
  const userID = users.checkSession(sessionID1).id;
  assert.equal(int, controller.getUserGames(userID).length);
});


/* Подключение к игре */

Given('авторизуется 2й пользователь с именем {string} и паролем {string}', (string1, string2) => {
  sessionID2 = users.loginUser(string1, string2);
});

Given('возвращается id сессии 2го игрока', () => {
  assert.notEqual(-1, sessionID2);
});

Given('2й пользователь подключается к игре', () => {
  const userID2 = users.checkSession(sessionID2).id;
  lastResult = controller.connectToGame(gameID, userID2);
});

Then('возвращается сообщение {string}', (string) => {
  const message = lastResult.text || lastResult;
  assert.equal(string, message);
});

Then('статус игры становится {string}', (string) => {
  assert.equal(string, controller.getGameStatus(gameID));
});

Given('игра с 2мя подключенными игроками', () => {
  // авторизуется 1й пользователь
  sessionID1 = users.loginUser('max', 'qwerty');
  // пользователь создает новую игру
  const userID = users.checkSession(sessionID1).id;
  gameID = controller.createGame(userID);

  // авторизуется 2й пользователь
  sessionID2 = users.loginUser('ivan', '123');
  // 2й пользователь подключается к игре
  const userID2 = users.checkSession(sessionID2).id;
  lastResult = controller.connectToGame(gameID, userID2);
});


/* Ход игрока */

Given('ходит игрок {int}', (int) => {
  controller.setCurrentPlayer(gameID, int);
});

Given('игрок ходит в клетку {int}, {int}', (x, y) => {
  const sessionID = controller.getCurrentPlayer(gameID) === 1 ? sessionID1 : sessionID2;

  return request(app)
    .post('/move')
    .set('Authorization', sessionID)
    .send({ gameID, x, y })
    .then((res) => {
      lastResult = res;
    });
});

Then('поле становится {string}', (string) => {
  assert.equal(string, controller.getField(gameID).join('|').replace(/,/g, ''));
});

Then('ход переходит к игроку {int}', (int) => {
  assert.equal(int, controller.getCurrentPlayer(gameID));
});

Given('поле {string}', (string) => {
  const field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  const newString = string.replace(/\|/g, '');

  // заполнение массива соответственно строке
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      field[i][j] = +newString[i * 3 + j];
    }
  }

  controller.presetField(gameID, field);
});

Then('победил игрок {int}', (int) => {
  assert.equal(int, controller.checkForWinner(gameID));
});
