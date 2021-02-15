const db = require("../models");
const AutobidConfigs = db.autobidConfigs

// Create or update an autobid config
exports.upsert = async (req, res) => {
  const autobidConfig = {
    user: req.params.user,
    max_amount: req.body.max_amount,
  };
  AutobidConfigs.upsert(autobidConfig)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the AutobidConfig."
      });
    });
};

// Retrieve autobidConfig for specific user.
exports.findOne = (req, res) => {
  AutobidConfigs.findOne({
    where: {
      user: req.params.user
    }
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while getting the AutobidConfig."
    });
  });
};
