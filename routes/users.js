const ExpressError = require("../helpers/expressError");
const Router = require("express").Router;
const User = require("../models/user");
const jsonschema = require("jsonschema");
const userSchema = require("../schemas/userSchema");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");
const { ensureCorrectUser } = require("../middleware/auth");

const router = new Router();

/*
 * GET /users route
 * Returns handle and name of all users matching parameters
 * {users: [userData, ...]}
 */

router.get("/", async function (req, res, next) {
  try {
    const users = await User.all(req.query);
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/*
 * POST /users
 * Creates a new user and returns it's data
 * {token: token}
 */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, userSchema);

    // Check against schema
    if (!result.valid) {
      let listOfErrors = result.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }

    const user = await User.create(req.body);

    // Check if duplicate username
    if (!user) {
      const err = new ExpressError("Username already taken", 400);
      return next(err);
    }

    // Create token with username as payload
    const token = jwt.sign(
      { username: user.username, is_admin: user.is_admin },
      SECRET_KEY
    );
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

/*
 * GET /users/:username
 * Returns data of one user matching username
 * {user: userData}
 */

router.get("/:username", async function (req, res, next) {
  try {
    const user = await User.get(req.params.username);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

/*
 * DELETE /users/:username
 * Deletes one user matching username
 * {message: "User deleted"}
 */

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    await User.delete(req.params.username);
    return res.json({ message: "User deleted" });
  } catch (err) {
    return next(err);
  }
});

/*
 * PATCH /users
 * Edits a user and returns it's data
 * {user: userData}
 */

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
  try {
    const user = await User.edit(req.params.username, req.body);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
