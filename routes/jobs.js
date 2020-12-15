const ExpressError = require("../helpers/expressError");
const Router = require("express").Router;
const Job = require("../models/job");
const jsonschema = require("jsonschema");
const jobSchema = require("../schemas/jobSchema");
const { ensureLoggedIn, ensureAdminUser } = require("../middleware/auth");

const router = new Router();

/*
 * GET /jobs route
 * Returns id and name of all jobs matching parameters
 * {jobs: [jobData, ...]}
 */

router.get("/", ensureLoggedIn, async function (req, res, next) {
  try {
    const jobs = await Job.all(req.query);
    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/*
 * POST /jobs
 * Creates a new job and returns it's data
 * {job: jobsData}
 */

router.post("/", ensureAdminUser, async function (req, res, next) {
  try {
    const result = jsonschema.validate(req.body, jobSchema);

    if (!result.valid) {
      let listOfErrors = result.errors.map((error) => error.stack);
      let error = new ExpressError(listOfErrors, 400);
      return next(error);
    }
    const job = await Job.create(req.body);
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/*
 * GET /jobs/:id
 * Returns data of one job matching id
 * {job: jobData}
 */

router.get("/:id", ensureLoggedIn, async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/*
 * DELETE /jobs/:id
 * Deletes one job matching id
 * {message: "Job deleted"}
 */

router.delete("/:id", ensureAdminUser, async function (req, res, next) {
  try {
    await Job.delete(req.params.id);
    return res.json({ message: "Job deleted" });
  } catch (err) {
    return next(err);
  }
});

/*
 * PATCH /jobs
 * Edits a job and returns it's data
 * {job: jobData}
 */

router.patch("/:id", ensureAdminUser, async function (req, res, next) {
  try {
    const job = await Job.edit(req.params.id, req.body);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
