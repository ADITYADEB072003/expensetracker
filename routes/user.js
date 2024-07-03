const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');
const Expense = require('../models/Expense');

// Signup Route
router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword,
      isAdmin: false // Regular user by default
    });
    await user.save();
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.redirect('/signup');
  }
});

// Login Route
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (user && await bcrypt.compare(req.body.password, user.password)) {
      req.session.userId = user._id;
      req.session.username = user.username;
      req.session.isAdmin = user.isAdmin;
      res.redirect('/dashboard');
    } else {
      res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Dashboard Route
router.get('/dashboard', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const user = await User.findById(req.session.userId);
    const expenses = await Expense.find({ userId: req.session.userId });

    res.render('dashboard', {
      username: user.username,
      expenses: expenses
    });
  } catch (err) {
    console.error(err);
    res.redirect('/login');
  }
});

// Add Expense Route
router.post('/add-expense', async (req, res) => {
  if (!req.session.userId) {
    return res.redirect('/login');
  }

  try {
    const expense = new Expense({
      userId: req.session.userId,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category
    });
    await expense.save();
    res.redirect('/dashboard');
  } catch (err) {
    console.error(err);
    res.redirect('/dashboard');
  }
});

// Logout Route
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
});

module.exports = router;
