const router = require('express').Router();
const controller = require('./game');


router.get('/getField', (req, res) => {
  res.status(200).send(controller.getField());
});

router.post('/move', (req, res) => {
  res.status(200).send(controller.makeMove(req.body.x, req.body.y));
});

router.post('/reset', (req, res) => {
  controller.reset();
  res.status(200).send('field is reseted');
});


module.exports = router;
