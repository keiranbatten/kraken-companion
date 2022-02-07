const KrakenService = require("../services/kraken_service");

const dashboardView = async (req, res) => {
  let krakenService = new KrakenService();

  req.session.loggedin = true;

  let gain_loss = await krakenService.getGainLoss();

  res.render("dashboard", {
    user: req.user,
    gain_loss: gain_loss,
  });
};

module.exports = {
  dashboardView,
};
