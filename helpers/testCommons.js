process.env.NODE_ENV = "test";
const db = require("../db");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");

const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

const jobIds = [];

const adminToken = jwt.sign({ username: "admin", is_admin: true }, SECRET_KEY);

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM jobs");
  await db.query("DELETE FROM companies");
  // Add users

  await User.create({
    username: "admin",
    password: "password",
    first_name: "Admin",
    last_name: "Admin",
    email: "admin@mail.com",
    is_admin: true,
  });
  await User.create({
    username: "janes",
    password: "password",
    first_name: "Jane",
    last_name: "Smith",
    email: "jane@mail.com",
  });

  // Add companies
  await Company.create({
    handle: "sample",
    name: "The Sample Company",
  });
  await Company.create({
    handle: "example",
    name: "The Example Company",
  });

  // Add jobs
  jobIds[0] = (
    await Job.create({
      title: "Software Engineer",
      salary: 90000.0,
      equity: 0.45,
      company_handle: "sample",
    })
  ).id;
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterAll() {
  await db.end();
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterAll,
  commonAfterEach,
  adminToken,
  jobIds,
};
