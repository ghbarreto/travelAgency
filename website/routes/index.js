const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const { isAdmin } = require('../config/isAdmin');

// Welcome Page
router.get('/admin', ensureAuthenticated, (req,res) => res.render('admin'));

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req,res) => res.render('dashboard.html', { name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin }));

// router.get('/admin', isAdmin, (req,res) => res.render('admin', { name: req.user.name, email: req.user.email, isAdmin: req.user.isAdmin }));


module.exports = router;