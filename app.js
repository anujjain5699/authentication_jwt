const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport')

//Passport config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;

//connect to Mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected ....'))
    .catch(err => console.log(`Error in connecting db=>${err}`));

//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs')

//Body Parser
app.use(express.urlencoded({ extended: false }))

//express session middleware
app.use(session({
    secret: "auth",
    resave: true,
    saveUninitialized: true,
}))

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//connect flash middleware
app.use(flash());

//Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
})


//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));


app.listen(port, console.log(`Server is running on port ${port}`));