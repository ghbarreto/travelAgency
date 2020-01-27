const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User models
const User = require('../models/User')

//  Login route
router.get('/login', (req,res) => res.render('Login'));


// ======================================

// Register route
router.get('/register', (req,res) => res.render('Register'));

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors =[];

    // fields
    if(!name || !email || !password || !password2){
        errors.push({msg: 'All fields must be filled before proceeding'})
    }

    // Check passwords match
    if(password != password2){
        errors.push({msg: 'Passwords are not equal'});
    }

    //Check pass length
    if(password.length < 6){
        errors.push({msg: 'Password has to have at least 6 characters'});
    }

    if(errors.length > 0){
        res.render('register', {
            errors, name, email, password, password2
        });
    }else{
        // Validation passed
        User.findOne({email: email})
        .then(user => {
            if(user){
                //User exists
                errors.push({msg: 'Email is already taken'});
                res.render('register', {
                    errors, name, email, password, password2
                });
            }else{
                const newUser = new User ({
                    name, email, password
                });
                // Hash Password
                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    // set password to hash
                    newUser.password = hash;
                    // save the user
                    newUser.save().then(user => {
                        req.flash('success_msg', 'You are now registered and can log-in');
                        res.redirect('/users/login');
                    }).catch(err => console.log(err));
                }))
            }
        });
    }
})
// Login
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
})
// ========================================

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('../users/login');
})

module.exports = router;