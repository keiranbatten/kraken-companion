//js
const express = require("express");
const {
  registerView,
  loginView,
  registerUser,
  loginUser,
} = require("../controllers/authController");
const { protectRoute } = require("../auth/protect");
const { dashboardView } = require("../controllers/dashboardController");

const router = express.Router();

router.get("/register", registerView);
router.get("/login", loginView);
router.get("/dashboard", protectRoute, dashboardView);
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("/login");
  });
});

router.post("/register", registerUser);
router.post("/login", loginUser);

module.exports = router;
