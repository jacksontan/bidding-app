module.exports = function(app) {
  require('./routes/users.routes')(app);
  require('./routes/items.routes')(app);
  require('./routes/bids.routes')(app);
  require('./routes/autobids.routes')(app);
  require('./routes/autobid.configs.routes')(app);
};
