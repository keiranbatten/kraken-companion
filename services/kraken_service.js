const KrakenClient = require("kraken-api");
const KRAKEN_KEY = process.env.KRAKEN_KEY || "";
const KRAKEN_SECRET = process.env.KRAKEN_SECRET || "";
const kraken = new KrakenClient(KRAKEN_KEY, KRAKEN_SECRET);
const Ledger = require("../models/Ledger");
const Snapshot = require("../models/Snapshot");

class KrakenService {
  constructor() {}

  async retrieveLedgers() {
    console.log("Retrieving ledgers");
    let ledgersResult = await kraken.api("Ledgers");
    let ledgers = ledgersResult["result"]["ledger"];
    console.log(
      `${Object.keys(ledgers).length} ledgers retrieved, processing...`
    );

    Object.keys(ledgers).forEach(async (ledgerid) => {
      let ledgerEntry = await Ledger.findOne({ ledgerid: ledgerid });
      if (ledgerEntry) {
        return;
      } else {
        console.log("New ledger found");
        let newLedger = new Ledger(ledgers[ledgerid]);
        newLedger.ledgerid = ledgerid;
        await newLedger.save();
      }
    });
  }

  async getGainLoss() {
    const ledgers = await Ledger.find({ type: { $in: ["spend", "receive"] } });
    let uniqueRefs = Array.from(new Set(ledgers.map((n) => n.refid)));
    return Promise.all(
      uniqueRefs.map(async (refid) => {
        let spendreceive = ledgers.filter((n) => n.refid == refid);
        let spend, receive;
        if (spendreceive[0].type == "spend") {
          spend = spendreceive[0];
          receive = spendreceive[1];
        } else {
          spend = spendreceive[1];
          receive = spendreceive[0];
        }
        let snapshots = await Snapshot.find({ refid: refid })
          .sort({ as_at: -1 })
          .limit(60);
        let snapshot = snapshots[snapshots.length - 1];
        snapshot.as_at = new Date(snapshot.as_at);
        return {
          refid: refid,
          bought_asset: receive.asset,
          bought_amount: receive.amount,
          bought_date: new Date(receive.time * 1000),
          spent_asset: spend.asset,
          spent_amount: -1 * spend.amount,
          time: `${snapshot.as_at.toLocaleDateString()} ${snapshot.as_at.toLocaleTimeString()}`,
          current_value: snapshot.current_value.toFixed(2),
          gain_loss: (
            (snapshot.current_value * 100) / (-1 * spend.amount) -
            100
          ).toFixed(2),
          snapshots: snapshots.reverse(),
        };
      })
    );
  }
}

module.exports = KrakenService;
