module.exports = (sequelize, Sequelize) => {
  const AutobidConfigs = sequelize.define("autobid_configs", {
    user: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    max_amount: {
      type: Sequelize.FLOAT
    }
  }, {
    timestamps: false
  });
  return AutobidConfigs;
};
