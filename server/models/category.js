const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contents: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "Expense",
    required: true
  },
  description: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Category = mongoose.model("category", CategorySchema);
