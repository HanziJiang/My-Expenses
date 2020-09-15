const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { authMessages } = require("../constants/strings");
const User = require("../models/user");
const config = require("../config");

const router = express.Router();

router.post(
  "/signup",
  [
    check("firstName", authMessages.firstNameMissing)
      .not()
      .isEmpty(),
    check("lastName", authMessages.lastNameMissing)
      .not()
      .isEmpty(),
    check("email", authMessages.invalidEmail).isEmail(),
    check("password", authMessages.passwordRequirement).isLength({ min: 4 })
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: authMessages.missingCredentials
      });
    }

    const { email, password, firstName, lastName } = req.body;

    try {
      let existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          succeed: false,
          message: authMessages.conflictEmail
        });
      }
      const user = new User({
        email,
        password,
        firstName,
        lastName
      });

      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      const payload = {
        user: {
          id: user.id
        }
      };
      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 300000 },
        (error, token) => {
          if (error) throw error;
          return res.json({
            succeed: true,
            message: authMessages.signUpSucceed,
            content: {
              token: token,
              firstName: user.firstName,
              lastName: user.lastName
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

router.post(
  "/login",
  [
    check("email", authMessages.invalidEmail).isEmail(),
    check("password", authMessages.passwordMissing)
      .not()
      .isEmpty()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        succeed: false,
        message: authMessages.missingCredentials
      });
    }
    const { email, password } = req.body;

    try {
      let existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(400).json({
          succeed: false,
          message: authMessages.invalidCredentials
        });
      }

      const isMatch = await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({
          succeed: false,
          message: authMessages.invalidCredentials
        });
      }

      const payload = {
        user: {
          id: existingUser.id
        }
      };

      jwt.sign(
        payload,
        config.jwtSecret,
        { expiresIn: 300000 },
        (error, token) => {
          if (error) throw error;
          return res.json({
            succeed: true,
            message: authMessages.LoginSucceed,
            content: {
              token: token,
              firstName: existingUser.firstName,
              lastName: existingUser.lastName
            }
          });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

module.exports = router;
