const User = require("../models/User");
const bcrypt = require("bcryptjs");

const usersView = async (req, res) => {
  req.session.loggedin = true;

  if (!req.user.admin) {
    res.redirect("/dashboard");
  }

  let users = await User.find({}).select("name email");

  res.render("users", {
    user: req.user,
    users: users,
  });
};

const userForm = async (req, res) => {
  req.session.loggedin = true;

  if (!req.user.admin && req.user._id != req.params.id) {
    res.redirect("/dashboard");
  }

  let user;
  let newUser;

  if (req.params.id) {
    user = await User.findById(req.params.id);
    newUser = false;
  } else {
    user = new User();
    newUser = true;
  }

  res.render("userForm", {
    user: req.user,
    editingUser: user,
    newUser: newUser,
  });
};

const addUser = async (req, res) => {
  req.session.loggedin = true;

  if (!req.user.admin) {
    res.redirect("/dashboard");
  }

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
              .then(res.redirect("/users"))
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
};

const updateUser = async (req, res) => {
  req.session.loggedin = true;

  if (!req.user.admin && req.user._id != req.params.id) {
    res.redirect("/dashboard");
  }

  const { name, email, password, confirm } = req.body;
  if (!name || !email) {
    console.log("Empty fields");
  }

  if (password && confirm) {
    if (password != confirm) {
      console.log("Passwords do not match");
    } else {
      User.findById(req.params.id).then((user) => {
        user.name = name;
        user.email = email;
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            user.hash = hash;
            user
              .save()
              .then(res.redirect("/users"))
              .catch((err) => console.log(err));
          });
        });
      });
    }
  } else {
    User.findById(req.params.id).then((user) => {
      user.name = name;
      user.email = email;
      user
        .save()
        .then(res.redirect("/users"))
        .catch((err) => console.log(err));
    });
  }
};

const deleteUser = async (req, res) => {
  req.session.loggedin = true;

  if (!req.user.admin) {
    res.redirect("/dashboard");
  }

  let id = req.params.id;
  await User.findByIdAndDelete(id);
  res.json();
};

module.exports = {
  usersView,
  userForm,
  addUser,
  updateUser,
  deleteUser,
};
