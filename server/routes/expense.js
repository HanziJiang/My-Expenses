const express = require("express");
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const { expenseMessages } = require("../constants/strings");
const Expense = require("../models/expense");
const User = require("../models/user");
const Category = require("../models/category");

const router = express.Router();

router.post(
  "/expenses",
  [
    auth,
    [
      check("amount", expenseMessages.amountMissing).isNumeric({ gt: 0 }),
      check("time", expenseMessages.timeMissing)
        .not()
        .isEmpty(),
      check("title", expenseMessages.descriptionMissing)
        .not()
        .isEmpty(),
      check("category")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: expenseMessages.invalidFields
      });
    }

    try {
      const { title, amount, time, description, category } = req.body;
      const newExpense = new Expense({
        title,
        amount,
        date: time,
        description,
        category
      });
      const expense = await newExpense.save();
      const expenseID = expense._id;

      const updateResult = await Category.updateOne(
        {
          _id: category
        },
        {
          $push: {
            contents: expenseID
          }
        }
      );

      if (updateResult.nModified != 1) {
        return res.status(400).json({
          succeed: false,
          message: expenseMessages.updateFail
        });
      }

      res.json({
        succeed: true,
        message: expenseMessages.createSuccess
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.get(
  "/expenses",
  [
    auth,
    [
      check("pageSize", expenseMessages.pageSizeMissing)
        .not()
        .isEmpty(),
      check("skipEntries", expenseMessages.skipEntriesMissing)
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: expenseMessages.invalidFields
      });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({
          succeed: false,
          message: expenseMessages.noUser
        });
      }
      const { skipEntries, pageSize } = req.query;

      const categoryIDs = user.categories;
      allExpenses = [];
      for (categoryID of categoryIDs) {
        existingCategoty = await Category.findById(categoryID);
        if (!existingCategoty) {
          return res.status(400).json({
            succeed: false,
            message: expenseMessages.noCategory
          });
        }
        allExpenses.push(...existingCategoty.contents);
      }

      expenses = await Expense.find({
        _id: {
          $in: allExpenses.slice(
            parseInt(skipEntries),
            parseInt(skipEntries) + parseInt(pageSize)
          )
        }
      });

      return res.json({
        succeed: true,
        message: expenseMessages.getSuccess,
        content: { expenses, expensesCount: expenses.length }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.delete(
  "/expenses",
  [auth, [check("expenseIDs", expenseMessages.deleteIdsMissing).isArray()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: expenseMessages.invalidFields
      });
    }

    const { expenseIDs } = req.body;

    try {
      for (expenseID of expenseIDs) {
        const expense = await Expense.findById(expenseID);
        if (!expense) {
          return res.status(400).json({
            succeed: false,
            message: expenseMessages.invalidFields
          });
        }
        const categoryID = expense.category;
        await Category.updateOne(
          { _id: categoryID },
          { $pull: { contents: expenseID } }
        );

        const delete_res = await Expense.deleteOne({
          _id: expenseID
        });
        if (delete_res.deletedCount != 1) {
          return res.status(400).json({
            succeed: false,
            message: expenseMessages.deleteFail
          });
        }
      }

      res.json({
        succeed: true,
        message: expenseMessages.deleteSuccess
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
