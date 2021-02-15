module.exports = (app) => {
  const autobidConfigs = require("../controllers/autobid.configs.controller.js");
  const users = require("../controllers/users.controller");
  app.get("/api/autobidConfigs/:user", users.isLoggedIn, autobidConfigs.findOne);
  app.post("/api/autobidConfigs/:user", users.isLoggedIn, autobidConfigs.upsert);
};
