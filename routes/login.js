//js
const express = require("express");
const { loginView, loginUser } = require("../controllers/authController");
const { protectRoute } = require("../auth/protect");
const { dashboardView } = require("../controllers/dashboardController");
const {
  usersView,
  userForm,
  addUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");

const router = express.Router();

const KrakenService = require("../services/kraken_service");
const { assetDetailView } = require("../controllers/assetDetailController");
const krakenService = new KrakenService();

router.get("/login", loginView);
router.get("/dashboard", protectRoute, dashboardView);
router.get("/asset/:refid", protectRoute, assetDetailView);
router.get("/users", protectRoute, usersView);
router.get("/users/new", protectRoute, userForm);
router.get("/users/:id", protectRoute, userForm);
router.get("/snapshots/:refid", async (req, res) => {
  let refid = req.params.refid;
  let timespan = req.query.timespan;
  let snapshots = await krakenService.getSnapshots(refid, timespan);
  res.json(snapshots);
});
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
});
router.get("/", function (req, res) {
  res.redirect("/dashboard");
});

router.post("/login", loginUser);
router.post("/add-user", addUser);
router.post("/update-user/:id", updateUser);

router.delete("/user/:id", deleteUser);

module.exports = router;
