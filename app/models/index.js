const dbConfig = require("../config/db.config.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  database: dbConfig.DB,
  username: dbConfig.USER,
  password: dbConfig.PASSWORD,
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: "0",
  protocol: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  }
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.autobidConfigs = require("./autobid.configs.model.js")(sequelize, Sequelize);
db.autobids = require("./autobids.model.js")(sequelize, Sequelize);
db.bids = require("./bids.model.js")(sequelize, Sequelize);
db.items = require("./items.model.js")(sequelize, Sequelize);

module.exports = db;
