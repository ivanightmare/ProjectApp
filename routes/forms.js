const express = require('express');
const router = express.Router();
const Form = require('../models/Form');

const { ensureAuthentication } = require('../config/auth');
const User = require('../models/User');

router.use((req, res, next) => {
    ensureAuthentication(req, res, next);
  });

// Get all forms
router.get('/addForm', (req, res) => {
    res.render('forms/addForm');
});


router.post('/addForm', async (req, res) => {
    const { name, address, phone, details } = req.body;
    const errors = [];
    if (!name || !address || !phone || !details) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (errors.length > 0) {
        res.render('forms/addForm', {
            errors,
            name,
            address,
            phone,
            details
        });
    }
    else { // Saving Task
        const newForm = {
          name: req.body.name,
          address: req.body.address,
          phone: req.body.phone,
          details: req.body.details,
          user: req.user.id
        }
        let forms = new Form(newForm);
        await forms.save();
        req.flash('success_msg', 'forms added.');
        res.redirect('/forms');
      }
    });


router.get('/', async (req, res) => {
        const forms = await Form.find({user: req.user.id})
      res.render("forms/form-dashboard", { forms });
});


router.get('/editForm/:id', async (req, res) => {
    const form = await Form.findById(req.params.id).lean();
    if (form.user != req.user.id) {
      req.flash("error_msg", "Not Authorized");
      return res.redirect("/forms");
    }
    res.render("forms/editForm", { form });
    });


// Update form
router.put('/edit/:id', async (req, res) => {
    User.updateOne({_id: req.user.id}, {$set: {name: req.body.name, email: req.body.email}}, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
        }
    });
    const form = await Form.findById(req.params.id);
    form.name = req.body.name;
    form.address = req.body.address;
    form.phone = req.body.phone;
    form.details = req.body.details;
    await form.save();
    req.flash('success_msg', 'forms updated.');
    res.redirect('/forms');
});




// Delete form
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    await Form.findByIdAndDelete(id);
    res.redirect('/forms');
});




module.exports = router;


