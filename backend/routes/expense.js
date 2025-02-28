const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const Expense = require('../models/Expense');

const router = express.Router();

// ✅ Add an Expense (POST /expenses)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const newExpense = new Expense({
      userId: req.user.id, // Get user ID from token
      amount,
      category,
      date,
      note
    });

    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error adding expense', error });
  }
});

// ✅ Get All Expenses for Logged-in User (GET /expenses)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expenses', error });
  }
});

// ✅ Update an Expense (PUT /expenses/:id)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, category, date, note } = req.body;
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id }, // Ensure user owns the expense
      { amount, category, date, note },
      { new: true }
    );

    if (!updatedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ message: 'Error updating expense', error });
  }
});

// ✅ Delete an Expense (DELETE /expenses/:id)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deletedExpense) return res.status(404).json({ message: 'Expense not found' });
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting expense', error });
  }
});

module.exports = router;
