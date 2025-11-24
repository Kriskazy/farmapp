const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   GET api/finance
// @desc    Get all transactions
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/finance
// @desc    Add a transaction
// @access  Private
router.post('/', protect, async (req, res) => {
  const { type, amount, category, description, date, relatedId, relatedModel } =
    req.body;

  try {
    const newTransaction = new Transaction({
      user: req.user.id,
      type,
      amount,
      category,
      description,
      date,
      relatedId,
      relatedModel,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/finance/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    // Check user
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await transaction.deleteOne();

    res.json({ msg: 'Transaction removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/finance/stats
// @desc    Get financial statistics
// @access  Private
router.get('/stats', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    const income = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const expense = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0);

    const balance = income - expense;

    // Monthly data for chart
    const monthlyData = transactions.reduce((acc, t) => {
      const month = new Date(t.date).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = { income: 0, expense: 0 };
      }
      if (t.type === 'income') acc[month].income += t.amount;
      if (t.type === 'expense') acc[month].expense += t.amount;
      return acc;
    }, {});

    res.json({
      income,
      expense,
      balance,
      monthlyData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
