const logger = require('./lib/logger');
const app = require('./server');

const port = 2000;

app.listen(port, () => {
  logger.log(`Example app listening on port ${port}!`);
});
