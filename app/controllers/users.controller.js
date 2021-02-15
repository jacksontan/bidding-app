const USERS = require("../config/users");
const CONFIG = require("../config/config");
const _ = require("lodash");
const jwt = require('jsonwebtoken');

const userCtrl = {};

userCtrl.login = (req, res) => {
  if (req.body.username && req.body.password) {
    const isValid = userCtrl.isValidCredentials(req.body.username, req.body.password);
    const timeout = CONFIG.timeouts.session * 1000;
    if (isValid) {
      const jwtToken = jwt.sign({
        "username": req.body.username,
        "password": req.body.password
      }, CONFIG.jwt.privateKey, {
        expiresIn: timeout
      });
      res.cookie("token", jwtToken, { "maxAge": timeout })
      res.send({
        "username": req.body.username,
        "token": jwtToken
      });
    } else {
      res.status(403).send({
        message: "Invalid credentials used."
      });
    }
  } else {
    res.status(400).send({
      message: "Username and/or password is required."
    });
  }
}

// Handles Authentication
userCtrl.isLoggedIn = (req, res, next) => {
  const token = userCtrl.extractToken(req);
  jwt.verify(token, CONFIG.jwt.privateKey, (err, decoded) => {
    if (err) {
      res.status(403).send({
        message: "Invalid credentials used."
      });
    }
    const isValid = decoded && userCtrl.isValidCredentials(decoded.username, decoded.password);
    if (isValid) {
      req.user = decoded.username;
      next();
    } else {
      res.status(403).send({
        message: "Invalid credentials used."
      });
    }
  });
};

userCtrl.isValidCredentials = (username, password) => {
  const userData = _.find(USERS.users, { username });
  return userData && userData.password === password;
}

userCtrl.extractToken = function(req) {
  return (
    (!!req.cookies && !!req.cookies["token"])
    ? req.cookies["token"]
    : (!!req.params && !!req.params["token"])
    ? req.params["token"]
    : (!!req.query && !!req.query["token"])
    ? req.query["token"]
    : (!!req.body && !!req.body["token"])
    ? req.body["token"]
    : (!!req.headers && !!req.headers["token"])
    ? req.headers["token"]
    : null
  );
};

module.exports = userCtrl;
