const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Expense = require('../models/Expense');

// Middleware to check if the user is an admin
function checkAdmin(req, res, next) {
  if (req.session.userId) {
    User.findById(req.session.userId, (err, user) => {
      if (err || !user || !user.isAdmin) {
        return res.redirect('/login');
      }
      next();
    });
  } else {
    res.redirect('/login');
  }
}

router.get('/admin', checkAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    const expenses = await Expense.find({});
    res.render('admin', { users, expenses });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
});

module.exports = router;
