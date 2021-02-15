const db = require("../models");
const Bids = db.bids;
const Autobids = db.autobids;

// Create an autobid
exports.create = async (req, res) => {
  const autobid = {
    user: req.body.user,
    item_id: req.body.item_id,
  };
  Autobids.create(autobid)
  .then(data => {
    res.send(data);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the autobid."
    });
  });
};

// Retrieve all Autobids from the database given the item id and not the last bidder.
const findAutobidsByOthers = async (item_id, user) => {
  const sql = `
    SELECT ac.user, ac.max_amount FROM autobids ab INNER JOIN autobid_configs ac ON ac.user = ab.user WHERE ab.user != $user AND item_id = $item_id LIMIT 1
  `;
  const data = await db.sequelize.query(sql, {
    bind: {
      item_id, user
    },
    type: db.sequelize.QueryTypes.SELECT
  });
  return data;
};

const getTotalAutobidAmount = async (item_id, user) => {
  const sql = `
    SELECT SUM(amount) AS total_autobid FROM bids WHERE item_id = $item_id AND "user" = $user AND is_autobid = true
  `;
  const data = await db.sequelize.query(sql, {
    bind: {
      item_id, user
    },
    type: db.sequelize.QueryTypes.SELECT
  });
  return data;
}

// Delete a Autobids with the specified id in the request
exports.delete = (req, res) => {
  Autobids.destroy({
    where: {
      id: req.params.id,
    }
  })
  .then(() => {
    res.sendStatus(200);
  })
  .catch(err => {
    res.status(500).send({
      message:
        err.message || "Some error occurred while deleting the autobid."
    });
  });
};

// Starts to check if autobid is enabled on given item id
exports.start = async (item_id, user, lastAmount) => {
  try {
    const userAutobidConfig = await findAutobidsByOthers(item_id, user);
    if (userAutobidConfig && userAutobidConfig[0]) {
      const autobidUser = userAutobidConfig[0];
      const totalAutobid = await getTotalAutobidAmount(item_id, autobidUser.user);
      if (totalAutobid && totalAutobid[0] && totalAutobid[0].total_autobid < autobidUser.max_amount) { // it means user autbid has not reach max amount
        const bid = {
          item_id: item_id,
          user: autobidUser.user,
          amount: lastAmount + 1,
          date: new Date(),
          is_autobid: true
        };
        await Bids.create(bid);
        module.exports["start"](item_id, autobidUser.user, lastAmount + 1);
      }
    }
  } catch (err) {
    console.log(`Some error occured in creating autobid for item ${item_id}`, err);
  }
};
