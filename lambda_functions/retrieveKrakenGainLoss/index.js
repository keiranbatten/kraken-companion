const KrakenClient = require("kraken-api");
const KRAKEN_KEY = process.env.KRAKEN_KEY || "";
const KRAKEN_SECRET = process.env.KRAKEN_SECRET || "";
const kraken = new KrakenClient(KRAKEN_KEY, KRAKEN_SECRET);
const mongoose = require("mongoose");
const Ledger = require("./models/Ledger");
const Snapshot = require("./models/Snapshot");

const MONGODB_URI = process.env.MONGODB_URI;

// cache connection for future use
let conn = null;

async function retrieveGainOrLoss(ledgers) {
  let uniqueRefs = Array.from(new Set(ledgers.map((n) => n.refid)));

  console.log("Retrieving asset pairs");
  let assetPairResult = await kraken.api("AssetPairs");
  let assetPairs = assetPairResult["result"];

  return await Promise.all(
    uniqueRefs.map(async (refid) => {
      let spend, receive;
      let spendreceive = ledgers.filter((n) => n.refid == refid);
      if (spendreceive.length == 2) {
        if (spendreceive[0].type == "spend") {
          spend = spendreceive[0];
          receive = spendreceive[1];
        } else {
          spend = spendreceive[1];
          receive = spendreceive[0];
        }
        let assetPair = Object.keys(assetPairs).filter(
          (n) =>
            assetPairs[n].base == receive.asset &&
            assetPairs[n].quote == spend.asset
        )[0];
        console.log(`Retrieving current price for pair ${assetPair}`);
        let tickerResult = await kraken.api("Ticker", { pair: assetPair });
        let recentlyTradedPrice = tickerResult["result"][assetPair]["a"][0];
        return {
          refid: refid,
          current_value: receive.amount * recentlyTradedPrice,
          as_at: new Date().toString(),
        };
      }
    })
  );
}

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("Connecting to database");

  if (conn == null) {
    conn = mongoose.connect(MONGODB_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    await conn;
  }

  console.log("Database connected");

  const ledgers = await Ledger.find({ type: { $in: ["spend", "receive"] } });

  console.log(`Retrieved ${ledgers.length} Ledgers`);

  console.log("Getting Gain/Loss Values");

  const gain_loss_values = await retrieveGainOrLoss(ledgers);

  await Promise.all(
    gain_loss_values.map(async (val) => {
      let newSnapshot = new Snapshot(val);
      await newSnapshot.save();
    })
  );

  const response = {
    statusCode: 200,
  };

  return response;
};
