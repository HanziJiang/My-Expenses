const mongoose = require("mongoose");

const ExpenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    required: true
  }
});

module.exports = Expense = mongoose.model("expense", ExpenseSchema);
