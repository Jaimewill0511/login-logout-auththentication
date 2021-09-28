const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const flash = require('connect-flash')
const session = require('express-session')
var passport = require('passport')
// passport config
require('./config/passport')(passport);

const routes = require('./routes/route')
const dbSetup = require("./db/setup");

const app = express();
require("dotenv").config();
dbSetup();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//express session
app.use(session({
    secret: process.env.secret,
    resave: true,
    saveUninitialized: true,
  }))

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash
app.use(flash());

// global vars
app.use((req, res, next) => {
res.locals.success_msg = req.flash('success_msg');
res.locals.error_msg = req.flash('error_msg');
res.locals.error = req.flash('error');
next();
});

// routes
app.use(routes)

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));

