const KrakenService = require("../services/kraken_service");

const krakenService = new KrakenService();

const assetDetailView = async (req, res) => {
  req.session.loggedin = true;

  let refid = req.params.refid;

  let asset = await krakenService.getLedger(refid);
  let snapshots = await krakenService.getSnapshots(refid, "1h");
  let current_value = snapshots[snapshots.length - 1].current_value.toFixed(2);
  let as_at = new Date(snapshots[snapshots.length - 1].as_at);
  let gain_loss = ((current_value * 100) / asset.spent_amount - 100).toFixed(2);
  let period_min = Math.min(...snapshots.map((n) => n.current_value)).toFixed(
    2
  );
  let period_max = Math.max(...snapshots.map((n) => n.current_value)).toFixed(
    2
  );
  let date_options = {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  };

  res.render("assetDetail", {
    user: req.user,
    asset: asset,
    snapshots: snapshots,
    current_value: current_value,
    as_at: as_at,
    gain_loss,
    period_max,
    period_min,
    date_options,
  });
};

module.exports = {
  assetDetailView,
};
