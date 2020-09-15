const jwt = require("jsonwebtoken");
const config = require("../config");

const { authMessages } = require("../constants/strings");

module.exports = function(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res
      .status(401)
      .json({ succeed: false, message: authMessages.noToken });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    res
      .status(401)
      .json({ succeed: false, message: authMessages.invalidToken });
  }
};
