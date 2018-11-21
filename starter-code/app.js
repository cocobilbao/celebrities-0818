require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session    = require("express-session");
const MongoStore = require('connect-mongo')(session);
const flash      = require("connect-flash");


const DBURL = process.env.DBURL;
console.log(DBURL)
mongoose.Promise = Promise;
mongoose
  .connect(DBURL, {useMongoClient: true})
  .then(() => {
    console.log('Connected to Mongo!')
  }).catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();

console.log(path.basename(__filename))


// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// ORDEN:
// bodyParser
// cookies
//session
//passport

app.use(session({
  secret: "Pepe",
  cookie: { maxAge: 60*60*24 }, // 1 days to expire cookie
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24*60*60 // 1 day
  })
}))

app.use(flash());
require('./passport')(app);

// Express View engine setup
app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

// default value for title and user

app.use((req,res,next) => {
  app.locals.title = 'Ejemplo de Juan';
  app.locals.user = req.user;
  next();
})

const index = require('./routes/index');
app.use('/', index);

const celebrities = require('./routes/celebrities');
app.use('/celebrities', celebrities);

const auth = require('./routes/auth');
app.use('/auth', auth);

module.exports = app;
