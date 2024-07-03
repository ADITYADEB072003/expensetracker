const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// GET all expenses
router.get('/', async (req, res, next) => {
  try {
    const expenses = await Expense.find();
    res.render('dashboard', { username: req.session.username, expenses });
  } catch (err) {
    next(err);
  }
});

// POST add new expense
router.post('/add', async (req, res, next) => {
  try {
    const { date, amount, category } = req.body;
    const newExpense = new Expense({ date, amount, category });
    await newExpense.save();
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
});

// POST delete expense
router.post('/delete/:id', async (req, res, next) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.redirect('/expenses');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
