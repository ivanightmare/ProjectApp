// Ivan Xie
// Cmpt 353
// Final Project




// start server with - npm start

const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');



const app = express();

require('./config/passport')(passport);
const { forwardAuthentication, ensureAuthentication, authRole } = require('./config/auth');
const User = require('./models/User');


// my mongoose connection
const uri = 'mongodb+srv://admin:admin@cluster0.rmklk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(uri,{ useNewUrlParser: true ,useUnifiedTopology: true}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));


app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: 'secreto',
    resave: true,
    saveUninitialized: true
  })
);


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
app.use('/forms', require('./routes/forms'));




 

const PORT = process.env.PORT || 8080;

app.listen(PORT, console.log(`Server running on  ${PORT}`));