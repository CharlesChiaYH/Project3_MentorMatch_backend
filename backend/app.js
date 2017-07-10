import session from 'express-session';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import logger from 'morgan';
import mongoose from 'mongoose';
import passport from 'passport';
//import multer
//import cloudinary


// import favicon from 'serve-favicon';
import path from 'path';
import lessMiddleware from 'less-middleware';
import index from './routes/index';
import carAPI from './routes/car';
import auth from './routes/auth';
//import eventsPage from './routes/events';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/cardb');
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

const app = express();
const debug = Debug('backend:app');

/**
 * API keys and Passport configuration.
 */
const passportConfig = require('./config/passport');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cookieParser());
app.use(lessMiddleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


const MongoStore = require('connect-mongo')(session);
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: "WDI Singapore",
  store: new MongoStore({
    url: 'mongodb://localhost/cardb',
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next){
  console.log( "Method: " + req.method +" Path: " + req.url)
  next();
});

app.use('/', index);
app.use('/api', carAPI);
app.use('/auth', auth);
//app.use('./events', eventsPage )

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

export default app;