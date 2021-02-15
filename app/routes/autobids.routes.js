module.exports = (app) => {
  const autobids = require("../controllers/autobids.controller.js");
  const users = require("../controllers/users.controller");
  app.post("/api/autobids", users.isLoggedIn, autobids.create);
  app.delete("/api/autobids/:id", users.isLoggedIn, autobids.delete);
};
