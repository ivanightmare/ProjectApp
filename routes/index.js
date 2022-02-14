const express = require('express');
const router = express.Router();
const { ensureAuthentication, forwardAuthentication } = require('../config/auth');

// Home Page
router.get('/', forwardAuthentication, (req, res) => res.render('home'));

// Dashboard
router.get('/dashboard', ensureAuthentication, (req, res) =>
  res.render('dashboard', {
    user: req.user
  })
);


// Admin dashboard
router.get('/userManagement', (req, res) => 
res.render('userManagement' , { 
  users: req.users
})
);

module.exports = router;