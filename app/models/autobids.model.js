module.exports = (sequelize, Sequelize) => {
  const Autobids = sequelize.define("autobids", {
    item_id: {
      type: Sequelize.INTEGER
    },
    user: {
      type: Sequelize.STRING
    }
  }, {
    indexes: [
      {
        unique: true,
        fields: ["item_id", "user"]
      }
    ],
    timestamps: false
  });
  return Autobids;
};
