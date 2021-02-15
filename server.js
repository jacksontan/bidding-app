const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const config = require("./app/config/config");

const app = express();

var corsOptions = {
  origin: config.cors.allowedOrigin
};

app.use(cors(corsOptions));

//use cookie - needed for auth
app.use(cookieParser())

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bidder app" });
});

require('./app/routes')(app);

const db = require("./app/models");
db.sequelize.sync().then(() => {
  // set port, listen for requests
  const PORT = process.env.PORT || 8081;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
}).catch((e) => {
  console.error("An error occured initializing database", e)
})
