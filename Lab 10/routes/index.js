const webRoutes = require('./webpageRoutes');

const constructor = (app) => {
  app.use('/', webRoutes);

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructor;