const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const KRAKEN_KEY = process.env.KRAKEN_KEY || "";
const KRAKEN_SECRET = process.env.KRAKEN_SECRET || "";
const KrakenClient = require('kraken-api');
const kraken = new KrakenClient(KRAKEN_KEY, KRAKEN_SECRET);

app.listen(PORT, console.log(`Server listening on port ${PORT}`));