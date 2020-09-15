const express = require("express");
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const { categoryMessages } = require("../constants/strings");
const User = require("../models/user");
const Expense = require("../models/expense");
const Category = require("../models/category");

const router = express.Router();

router.post(
  "/categories",
  [
    auth,
    [
      check("name", categoryMessages.nameMissing)
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: categoryMessages.invalidFields
      });
    }

    try {
      const token = req.user.id;
      const user = await User.findById(token).select("-password");
      if (!user) {
        return res.status(400).json({
          succeed: false,
          message: categoryMessages.noUser
        });
      }

      const name = req.body.name;
      const categoryIDs = user.categories;
      for (categoryID of categoryIDs) {
        existingCategoty = await Category.findById(categoryID);
        if (!existingCategoty) {
          return res.status(400).json({
            succeed: false,
            message: categoryMessages.noCategory
          });
        }
        if (existingCategoty.name == name) {
          return res.status(409).json({
            succeed: false,
            message: categoryMessages.conflictName
          });
        }
      }

      const newCategory = new Category({ name });
      const category = await newCategory.save();

      await User.updateOne(
        { _id: token },
        { $push: { categories: category._id } }
      );

      return res.json({
        succeed: true,
        message: categoryMessages.createSuccess
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.get(
  "/categories",
  [
    auth,
    [
      check("pageSize", categoryMessages.pageSizeMissing)
        .not()
        .isEmpty(),
      check("skipEntries", categoryMessages.skipEntriesMissing)
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: categoryMessages.invalidFields
      });
    }

    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(400).json({
          succeed: false,
          message: categoryMessages.noUser
        });
      }
      const { skipEntries, pageSize } = req.query;

      const categoryIDs = user.categories;
      const totalCategoriesCount = categoryIDs.length;

      categories = await Category.find({
        _id: {
          $in: categoryIDs.slice(
            parseInt(skipEntries),
            parseInt(skipEntries) + parseInt(pageSize)
          )
        }
      });

      return res.json({
        succeed: true,
        message: categoryMessages.getSuccess,
        content: { categories, totalCategoriesCount }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

router.delete(
  "/categories",
  [auth, [check("categoryIDs", categoryMessages.deleteIdsMissing).isArray()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: categoryMessages.invalidFields
      });
    }

    try {
      const token = req.user.id;
      const user = await User.findById(token).select("-password");
      if (!user) {
        return res.status(400).json({
          succeed: false,
          message: categoryMessages.noUser
        });
      }

      const { categoryIDs } = req.body;

      totalCategoriesCount = user.categories.length;

      for (categoryID of categoryIDs) {
        const category = Category.findById(categoryID);
        const contents = category.contents;
        Expense.deleteMany({ _id: { $in: contents } });
      }

      const delete_res = await Category.deleteMany({
        _id: {
          $in: categoryIDs
        }
      });

      if (delete_res.deletedCount != categoryIDs.length) {
        return res.status(400).json({
          succeed: false,
          message: categoryMessages.deleteFail
        });
      }

      await User.updateOne(
        { _id: token },
        {
          $pull: {
            categories: {
              $in: categoryIDs
            }
          }
        }
      );

      totalCategoriesCount = totalCategoriesCount - categoryIDs.length;

      return res.json({
        succeed: true,
        message: categoryMessages.deleteSuccess,
        content: {
          totalCategoriesCount
        }
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send(err.message);
    }
  }
);

module.exports = router;
