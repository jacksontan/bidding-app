module.exports = (sequelize, Sequelize) => {
  const Bids = sequelize.define("bids", {
    item_id: {
      type: Sequelize.INTEGER
    },
    user: {
      type: Sequelize.STRING
    },
    amount: {
      type: Sequelize.FLOAT
    },
    date: {
      type: Sequelize.DATE
    },
    is_autobid: {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    }
  }, {
    timestamps: false
  });
  return Bids;
};
