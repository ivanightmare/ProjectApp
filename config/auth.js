const User = require("../models/User")


function authRole(roles) {
  return (req, res, next) => {
  if (req.user.role !== roles) {
    res.status(401)
    return res.send('You are not authorized to view this page, this page is only for ' + roles)
  }
  next()
}} 

function ensureAuthentication
  (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/users/login')
}

function forwardAuthentication
  (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/dashboard')
}


module.exports = {
  authRole,
  ensureAuthentication,
  forwardAuthentication,
  
}



