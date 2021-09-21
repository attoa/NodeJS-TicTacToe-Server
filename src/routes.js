const router = require('express').Router();
const controller = require('./game');
const users = require('./lib/users');


router.post('/register', (req, res) => {
  users.registerUser(req.body.login, req.body.password);
  res.status(200).send('you have registered');
});

router.post('/login', (req, res) => {
  const sessionID = users.loginUser(req.body.login, req.body.password);
  res.status(200).send(sessionID);
});

router.post('/createGame', users.restrictMiddleware, (req, res) => {
  const gameID = controller.createGame(req.userCredentials.id);
  res.status(200).send(gameID);
});

router.get('/getGames', users.restrictMiddleware, (req, res) => {
  const games = controller.getUserGames(req.userCredentials.id);
  res.status(200).send(games);
});

router.get('/getField', users.restrictMiddleware, (req, res) => {
  const field = controller.getField(req.body.gameID);
  res.status(200).send(field);
});

router.get('/getStatus', users.restrictMiddleware, (req, res) => {
  const status = controller.getGameStatus(req.body.gameID);
  res.status(200).send(status);
});

router.post('/connect', users.restrictMiddleware, (req, res) => {
  const status = controller.connectToGame(req.body.gameID, req.userCredentials.id);
  res.status(200).send(status);
});

router.post('/move', users.restrictMiddleware, (req, res) => {
  const message = controller.makeMove(req.body.gameID, req.userCredentials.id,
    req.body.x, req.body.y);
  res.status(200).send(message);
});

router.post('/reset', users.restrictMiddleware, (req, res) => {
  const message = controller.reset(req.body.gameID, req.userCredentials.id);
  res.status(200).send(message);
});


module.exports = router;
