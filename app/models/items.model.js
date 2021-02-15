module.exports = (sequelize, Sequelize) => {
  const Items = sequelize.define("items", {
    name: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    start_amount: {
      type: Sequelize.FLOAT
    },
    bid_end_date: {
      type: Sequelize.DATE
    },
    picture: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  });
  return Items;
};
