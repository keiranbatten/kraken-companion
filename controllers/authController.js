const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const loginView = (req, res) => {
  res.render("login", {});
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Please fill in all the fields");
    res.render("login", {
      email,
      password,
    });
  } else {
    passport.authenticate("local", {
      successRedirect: "/dashboard",
      failureRedirect: "/login",
      failureFlash: true,
    })(req, res);
  }
};

module.exports = {
  loginView,
  loginUser,
};
