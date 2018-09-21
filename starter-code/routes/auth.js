const express = require("express");
const Router = express.Router();
const passport = require("passport");
const User = require("../models/User");
//Hash de la password
const bcrypt = require("bcrypt");
const bcryptSalt = 8;
//Midelware passport
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login');


Router.get("/signup", (req, res) => {
  console.log("entra");
  res.render("auth/signup", { "message": req.flash("error") });
});

// ELEGIR UNO DE LOS DOS SIGNUP


//Signup casero

Router.post("/signup", (req, res, next) => {
  const { username, password, email } = req.body;
  //const username = req.body.username;
  //const password = req.body.password;
  //const email = req.body.email;

  if(username === "" || password === ""){
    res.redirect("/auth/signup");
    return;
  }
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPassword = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPassword,
    email
  });
  newUser
    .save()
    .then(user => {
      res.redirect("/");
    })
    .catch(err => {
      console.log(err);
      res.redirect("/auth/signup");
    });
});

//Signup con Passport

// Router.post('/signup', passport.authenticate('local-signup', { //Mismo nombre que en LocalStrategy del signup de passport
//   successRedirect : '/',
//   failureRedirect : '/auth/signup',
//   failureFlash : true
// }));


Router.get("/login", (req, res) => {
  res.render("auth/login", { "message": req.flash("error") });
});

Router.post("/login",
  passport.authenticate("Pepelandia", { //Mismo nombre que en LocalStrategy del login de passport
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true
  }));

Router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
  // Para cerrar Sesion si no se utiliza passport.
  // req.session.destroy(err => {
  //     res.redirect("/");
  //   });
});
module.exports = Router;
