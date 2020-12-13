const ExpressError = require("../helpers/expressError");
const Router = require("express").Router;
const Company = require("../models/company");
const jsonschema = require("jsonschema");
const companySchema = require("../schemas/companySchema");

const router = new Router();

/*
 * GET /companies route
 * Returns handle and name of all companies matching parameters
 * {companies: [companyData, ...]}
 */

router.get("/", async function (req, res, next) {
  try {
    const companies = await Company.all(req.query);
    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

/*
 * POST /companies
 * Creates a new company and returns it's data
 * {company: companyData}
 */

router.post("/", async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, companySchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

/*
 * GET /companies/:handle
 * Returns data of one company matching handle
 * {company: companyData}
 */

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

/*
 * DELETE /companies/:handle
 * Deletes one company matching handle
 * {message: "Company deleted"}
 */

router.delete("/:handle", async function (req, res, next) {
  try {
    await Company.delete(req.params.handle);
    return res.json({ message: "Company deleted" });
  } catch (err) {
    return next(err);
  }
});

/*
 * PATCH /companies
 * Edits a company and returns it's data
 * {company: companyData}
 */

router.patch("/:handle", async function (req, res, next) {
  try {
    const company = await Company.edit(req.params.handle, req.body);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
