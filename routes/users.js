const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/User');
const auth = require('../config/auth');
const { forwardAuthentication, ensureAuthentication, authRole } = require('../config/auth');


// Login Page
router.get('/login', forwardAuthentication, function(req, res){
  res.render('login');
});

// Register Page
router.get('/register', forwardAuthentication, function(req, res){
   res.render('register');
});

// Profile Page
router.get('/profile', ensureAuthentication, function(req, res){
   res.render('profile');
});


// Register
router.post('/register', (req, res) => {
  const { name, email, password, password2 ,role} = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please enter all fields' });
  }
  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
          role: role || "user"
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});


// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});




/// admin dashboard 


// display all users just for admin

router.get('/userManagement', ensureAuthentication,authRole('admin'),function(req, res) {
  User.find({}, function(err, users) {
    res.render('userManagement', {
      title: 'User Management',
      users: users
    });
  });
});




// delete user

router.get('/delete/:id', (req,res)=>{
  let id = req.params.id;
  User.findByIdAndDelete(id, (err, users)=>{
      if(err){console.log(err);}
      res.redirect('/users/userManagement');
  });
});


// edit user

router.get('/edit1/:id', (req,res)=>{
  let id = req.params.id;
  User.findById(id, (err, users)=>{
      if(err){console.log(err);}
      res.render('edit1', {
        title: 'Edit User',
        users: users
      });
  });
});


router.post('/edit1/:id', (req,res)=>{
  const { name, email, password ,role} = req.body;
  let errors = [];

  if (!name || !email || !password || !role) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (errors.length > 0) {
    res.render('edit1', {
      errors,
      name,
      email,
      password,
      role
    });
  } else { // Saving Task
    const newForm = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    };
   let users = User.findByIdAndUpdate(req.body.id, newForm, (err, users)=>{

      if(err){console.log(err);}
      res.redirect('/users/userManagement');
    }
  );

  }
});



// set user role
router.get('/setuser/:id', (req,res)=>{
  let id = req.params.id;
  User.findByIdAndUpdate(id, {role: 'user'}, (err, users)=>{
      if(err){console.log(err);}
      res.redirect('/users/userManagement');
  });
});

// set admin role
router.get('/setadmin/:id', (req,res)=>{
  let id = req.params.id;
  User.findByIdAndUpdate(id, {role: 'admin'}, (err, users)=>{
      if(err){console.log(err);}
      res.redirect('/users/userManagement');
  });
});

// set staff role
router.get('/setstaff/:id', (req,res)=>{
  let id = req.params.id;
  User.findByIdAndUpdate(id, {role: 'staff'}, (err, users)=>{
      if(err){console.log(err);}
      res.redirect('/users/userManagement');
  });
});





module.exports = router;

