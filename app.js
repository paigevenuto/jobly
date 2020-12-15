/** Express app for jobly. */

const express = require("express");
const ExpressError = require("./helpers/expressError");
const morgan = require("morgan");
const app = express();
const { authenticateJWT } = require("./middleware/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// add logging system
app.use(morgan("tiny"));

// get auth token for all routes
app.use(authenticateJWT);

/*
 *Routes
 */

const companiesRoutes = require("./routes/companies");
const jobRoutes = require("./routes/jobs");
const userRoutes = require("./routes/users");
const loginRoutes = require("./routes/login");
app.use("/companies", companiesRoutes);
app.use("/jobs", jobRoutes);
app.use("/users", userRoutes);
app.use("/login", loginRoutes);

/** 404 handler */

app.use(function (req, res, next) {
  const err = new ExpressError("Not Found", 404);
  return next(err);
});

/** general error handler */

app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  if (process.env.NODE_ENV != "test") console.error(err.stack);

  return res.json({
    error: err,
    message: err.message,
  });
});

module.exports = app;
