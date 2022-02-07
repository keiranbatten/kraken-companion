const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const registerView = (req, res) => {
  res.render("register", {});
};

const registerUser = (req, res) => {
  const { name, email, password, confirm } = req.body;
  if (!name || !email || !password || !confirm) {
    console.log("Empty fields");
  }

  if (password != confirm) {
    console.log("Passwords do not match");
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("A user already exists with this email");
        res.render("register", {
          name,
          email,
          password,
          confirm,
        });
      } else {
        const newUser = new User({
          name,
          email,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            newUser.hash = hash;
            newUser
              .save()
              .then(res.redirect("/login"))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};

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
  registerView,
  loginView,
  registerUser,
  loginUser,
};
