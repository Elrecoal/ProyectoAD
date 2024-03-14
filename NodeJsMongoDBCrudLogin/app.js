var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const logger = require('morgan');
const fileUpload = require('express-fileupload');//Nueva constante para configurar la subida de archivos
var app = express();
//require('./database');

require('./passport/local-auth');
var tasksRouter = require('./routes/tasks');
var usersRouter = require('./routes/users');
var softwaresRouter = require('./routes/softwares');//Necesario para que pueda acceder a la ruta nueva de softwares
var suggestionsRouter = require('./routes/sugerencias');


//Conexión con la base de datos
const mongoose = require('mongoose');
//Para cambiar de base de datos, añadir el nombre de la misma después del .net/
mongoose.connect('mongodb+srv://ellie:1234@cluster0.goxma4m.mongodb.net/ProyectoNode_FinalTest?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
).then(db => console.log('db connected'))
  .catch(err => console.log(err));
// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// middlewares
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());//Para la subida de archivos
// middlewares


app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.signupMessage = req.flash('signupMessage');
  app.locals.user = req.user;
  next();
});

//routes
app.use('/', usersRouter);
app.use('/', tasksRouter);
app.use('/', softwaresRouter);//Necesario para que pueda acceder a la ruta nueva de softwares
app.use('/', suggestionsRouter);//Necesario para que pueda acceder a la ruta nueva de softwares


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;