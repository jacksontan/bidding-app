module.exports = (app) => {
  const items = require("../controllers/items.controller.js");
  const users = require("../controllers/users.controller");
  app.get("/api/items/count", users.isLoggedIn, items.getRecordCount);
  app.get("/api/items", users.isLoggedIn, items.findAll);
  app.get("/api/items/:id", users.isLoggedIn, items.findOne);
};
