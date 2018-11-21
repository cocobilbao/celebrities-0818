const passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const bcrypt        = require('bcrypt');
const bcryptSalt = 8;

passport.use('Pepelandia', new LocalStrategy({ //Mismo nombre que ruta en la que quieres utilizar login de passport
    usernameField: 'username',
    passwordField: 'password'
  }, 
  (username, password, next) => {
    User.findOne({ username })
    .then(foundUser => {
      if (!foundUser) {
        next(null, false, { message: 'Incorrect username' });
        return;
      }

      if (!bcrypt.compareSync(password, foundUser.password)) {
        next(null, false, { message: 'Incorrect password' });
        return;
      }

      next(null, foundUser);
    })
    .catch(err => next(err));
  }
));
passport.use('local-signup', new LocalStrategy(  //Mismo nombre que ruta en la que quieres utilizar signup de passport
  { passReqToCallback: true },
  (req, username, password, next) => {
    // To avoid race conditions
    process.nextTick(() => {
        User.findOne({
            'username': username
        }, (err, user) => {
            if (err){ return next(err); }

            if (user) {
                return next(null, false);
            } else {
                // Destructure the body
                const {email} = req.body;
                const salt = bcrypt.genSaltSync(bcryptSalt);
                const hashPass = bcrypt.hashSync(password, salt);
                
                
                  const newUser = new User({
                    username,
                    email,
                    password: hashPass
                  });
                  newUser.save((err) => {
                      if (err){ next(null, false, { message: newUser.errors }) }
                      return next(null, newUser);
                  });
                
            }
        });
    });
}));