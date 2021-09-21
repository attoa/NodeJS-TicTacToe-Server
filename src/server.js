const express = require('express');
const cors = require('cors');
const users = require('./lib/users');
const routes = require('./routes');


const app = express();

app.use(express.json());
app.use(cors());
app.use(users.authMiddleware);
app.use(routes);


module.exports = app;
