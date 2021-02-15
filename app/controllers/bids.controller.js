const db = require("../models");
const Bids = db.bids
const autobids = require("./autobids.controller.js");

// Create and Save a new Bid
exports.create = async (req, res) => {
  let lastBid;
  try {
    lastBid = await findLastBid(req.body.item_id);
  } catch (err) {
    return res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Bid."
    });
  };
  if (lastBid[0] && lastBid[0].amount >= req.body.amount) {
    return res.send({
      message: `The bid amount should be greater than the last bid of ${lastBid[0].amount}`
    });
  }

  const bid = {
    item_id: req.body.item_id,
    user: req.body.user,
    amount: req.body.amount,
    date: new Date(),
    is_autobid: req.body.is_autobid || false
  };
  Bids.create(bid)
    .then(data => {
      autobids.start(req.body.item_id, req.body.user, req.body.amount);
      return res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Bid."
      });
    });
};

// Retrieve all Bids from the database.
exports.findAll = (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page - 1) * limit;
  const order = [["date", "desc"]];
  Bids.findAll({
    where: {
      item_id: req.params.item_id
    },
    order, offset, limit
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Bids."
    });
  });
};

// Find a last Bid with an item id
const findLastBid = async (item_id) => {
  const lastBid = await Bids.findAll({
    where: { item_id },
    order: [["date", "desc"]],
    limit: 1
  });
  return lastBid;
};
