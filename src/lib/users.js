const uuid = require('uuid');


const users = [
  {
    id: 1,
    login: 'max',
    password: 'qwerty',
  },
  {
    id: 2,
    login: 'ivan',
    password: '123',
  },
];

const sessions = [];
/* session object structure:
[key]   session id in the uuid format
{
  id    user id
}
*/


function registerUser(login, password) {
  let maxID = 0;
  users.forEach((u) => { if (u.id > maxID) maxID = u.id; }); // getting the current max ID

  users.push({
    id: maxID + 1,
    login,
    password,
  });
}

function checkExisting(login, password) {
  const user = users.find((u) => u.login === login && u.password === password);
  return user;
}

function loginUser(login, password) {
  const user = checkExisting(login, password);
  if (user) {
    const sessionID = uuid.v4();
    sessions[sessionID] = {
      id: user.id,
    };

    return sessionID;
  }

  return -1;
}

function checkSession(sessionID) {
  if (sessions[sessionID]) {
    return sessions[sessionID];
  }

  return -1;
}


/* functions for tests */

function clearSessions() {
  sessions.length = 0;
}


/* middleware functions */

function authMiddleware(req, res, next) {
  const userCredentials = checkSession(req.headers.authorization);
  req.userCredentials = userCredentials;

  next();
}

function restrictMiddleware(req, res, next) {
  if (req.userCredentials === -1) {
    res.send(401);
    return;
  }

  next();
}


module.exports = {
  registerUser,
  checkExisting,
  loginUser,
  checkSession,
  clearSessions,
  authMiddleware,
  restrictMiddleware,
};
