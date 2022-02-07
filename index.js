//imports
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const KrakenService = require("./services/kraken_service");

const app = express();

const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
  })
);

app.use(function (req, res, next) {
  res.locals.session = req.session;
  next();
});

app.set("view engine", "ejs");

const passport = require("passport");
const { loginCheck } = require("./auth/passport");
loginCheck(passport);

const PORT = process.env.PORT || 4000;

//MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;
mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then(() => console.log("Mongoose connected"))
  .catch((err) => console.log(err));

app.use(express.urlencoded({ extended: false }));

app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use("/", require("./routes/login"));

app.listen(PORT, console.log(`Server listening on port ${PORT}`));

// let krakenService = new KrakenService();
//krakenService.retrieveLedgers();
// krakenService.showGainOrLoss();
