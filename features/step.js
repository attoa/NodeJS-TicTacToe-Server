const { Given, Then } = require('cucumber');
const request = require('supertest');
const assert = require('assert');
const controller = require('../src/game');
const app = require('../src/server');


let lastResult = {};

Given('пустое поле', () => {
  controller.reset();
});

Given('ходит игрок {int}', (i) => {
  controller.setCurrentPlayer(i);
});

Given('игрок ходит в клетку {int}, {int}', (x, y) => request(app)
  .post('/move')
  .send({ x, y })
  .then((res) => {
    lastResult = res;
  }));

Then('поле становится {string}', (string) => {
  assert.equal(string, controller.getField().join('|').replace(/,/g, ''));
});

Then('ход переходит к игроку {int}', (int) => {
  assert.equal(int, controller.getCurrentPlayer());
});

Given('поле {string}', (string) => {
  const field = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

  const newString = string.replace(/\|/g, '');

  // filling the field according to string
  for (let i = 0; i < 3; i += 1) {
    for (let j = 0; j < 3; j += 1) {
      field[i][j] = +newString[i * 3 + j];
    }
  }

  controller.presetField(field);
});

Then('возвращается сообщение {string}', (string) => {
  assert.equal(string, lastResult.text);
});

Then('победил игрок {int}', (int) => {
  assert.equal(int, controller.checkForWinner());
});
