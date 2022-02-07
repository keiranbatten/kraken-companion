const bcrypt = require("bcryptjs");
localStrategy = require("passport-local").Strategy;

const User = require("../models/User");
const loginCheck = (passport) => {
  passport.use(
    new localStrategy({ usernameField: "email" }, (email, password, done) => {
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done();
          }
          bcrypt.compare(password, user.hash, (error, isMatch) => {
            if (error) {
              throw error;
            }
            if (isMatch) {
              return done(null, user);
            } else {
              return done();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (error, user) => {
      done(error, user);
    });
  });
};

module.exports = {
  loginCheck,
};
