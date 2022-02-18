const KrakenService = require("../services/kraken_service");

let gain_loss = [];

let krakenService = new KrakenService();

function getAsset(asset_id) {
  let asset = gain_loss.find((n) => n.refid == asset_id);
  return asset;
}

function getSnapshots(timespan) {
  krakenService.getSnapshots(timespan).then((snapshots) => {
    return snapshots;
  });
}

const dashboardView = async (req, res) => {
  req.session.loggedin = true;

  gain_loss = await krakenService.getGainLoss();

  res.render("dashboard", {
    user: req.user,
    gain_loss: gain_loss,
    getAsset: getAsset,
    getSnapshots: getSnapshots,
  });
};

module.exports = {
  dashboardView,
};
