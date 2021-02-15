module.exports = (app) => {
  const usersCtrl = require("../controllers/users.controller.js");
  app.post("/api/login", usersCtrl.login);
};
