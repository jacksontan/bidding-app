module.exports = (app) => {
  const bids = require("../controllers/bids.controller.js");
  const users = require("../controllers/users.controller");
  app.get("/api/bids/:item_id", users.isLoggedIn, bids.findAll);
  app.post("/api/bids", users.isLoggedIn, bids.create);
};
