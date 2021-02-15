const db = require("../models");
const Items = db.items;

// Create and Save a new Item
exports.create = (req, res) => {
  const item = {
    name: req.body.name,
    description: req.body.description,
    start_amount: req.body.start_amount,
    bid_end_date: req.body.bid_end_date
  };

  Items.create(item)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Item."
      });
    });
};

// Retrieve all Items from the database.
exports.findAll = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const offset = (page-1) * limit;
  let order = req.query.order || "amount";
  order = order.replace(/'/g, "''");
  const sql = `
    SELECT i.id, i.name, i.description, coalesce(MAX(b.amount), i.start_amount) AS amount, i.bid_end_date
    FROM items i LEFT JOIN bids b ON b.item_id = i.id
    GROUP BY i.id, i.name, i.description, i.start_amount, i.bid_end_date
    ORDER BY ${order}
    OFFSET $offset LIMIT $limit
  `;
  try {
    const data = await db.sequelize.query(sql, {
      bind: {
        offset, limit
      },
      type: db.sequelize.QueryTypes.SELECT
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Items."
    });
  }
};

// Find a single Item with an id
exports.findOne = async (req, res) => {
  const sql = `
    SELECT i.id, i.name, i.description, coalesce(MAX(b.amount), i.start_amount) AS amount, i.bid_end_date, ab.id AS autobid_id
    FROM items i LEFT JOIN bids b ON b.item_id = i.id
    LEFT JOIN autobids ab ON ab.item_id = i.id AND ab.user = $user
    WHERE i.id = $id
    GROUP BY i.id, i.name, i.description, i.start_amount, i.bid_end_date, ab.id
  `;
  try {
    const data = await db.sequelize.query(sql, {
      bind: {
        id: req.params.id,
        user: req.user
      },
      type: db.sequelize.QueryTypes.SELECT
    });
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving item."
    });
  }
};

// Find a max record for paging
exports.getRecordCount = async (req, res) => {
  Items.findAll({
    attributes: [
      [db.sequelize.fn("COUNT", "1"), "item_count"],
    ]
  })
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving Items count."
    });
  });
};
