const Router = require("express").Router;
const User = require("../models/user");
const ExpressError = require("../helpers/expressError");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const router = new Router();

router.post("/", async function (req, res, next) {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.get(username);
    if (!user) {
      const err = new ExpressError("User does not exist", 400);
      return next(err);
    }

    // Verify credentials
    const authResult = await User.authenticate(username, password);
    if (!authResult) {
      const err = new ExpressError("Invalid credentials", 400);
      return next(err);
    }

    const token = jwt.sign(
      { username: user.username, is_admin: user.is_admin },
      SECRET_KEY
    );
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
