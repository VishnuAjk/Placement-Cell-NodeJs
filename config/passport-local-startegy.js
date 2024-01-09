const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/userSchema');

const local = new LocalStrategy({ usernameField: 'email' }, function (
  email,
  password,
  done
) {
  User.findOne({ email }, function (error, user) {
    if (error) {
      console.log(`Error in Finnding  the user: ${error}`);
      return done(error);
    }

    if (!user || !user.isPasswordCorrect(password)) {
      console.log('Invalid Username/Password');
      return done(null, false);
    }
    return done(null, user);
  });
});

passport.use('local', local);

//Serializing user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//Deserializing the user
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    if (err) {
      console.log('Error in finding user - Passport');
      return done(err);
    }
    return done(null, user);
  });
});

// check if user is authenticated
passport.checkAuthentication = function (req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/users/signin');
};

//Set authenticated Users for Views
passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    res.locals.user = req.user;
  }
  next();
};
