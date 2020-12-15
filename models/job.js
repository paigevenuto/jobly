const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const db = require("../db");
const sqlForInsert = require("../helpers/insert");

class Job {
  /*
   * ALL
   * Returns handle and name of all jobs matching parameters
   * {jobs: [jobData, ...]}
   */

  static async all(params) {
    // Prepares values from parameters

    const paramValues = { ...params };
    if (paramValues.search) paramValues.search = `%${paramValues.search}%`;

    // Templates for generating query

    let baseQuery = `SELECT title, company_handle FROM jobs`;
    const clauseTemplates = {
      min_equity: "equity >= $",
      min_salary: "salary >= $",
      search: "title ILIKE $",
    };
    const queryValues = [];
    const queryClauses = [];

    // Generates WHERE clauses from values

    for (const key of Object.keys(paramValues)) {
      queryValues.push(paramValues[key]);
      const newClause = clauseTemplates[key] + `${queryValues.length}`;
      queryClauses.push(newClause);
    }

    // Combines clauses with base query

    if (queryClauses.length > 0) {
      baseQuery = baseQuery + " WHERE ";
      baseQuery = baseQuery + queryClauses.join(" AND ");
    }

    // Executes query and returns
    const results = await db.query(baseQuery, queryValues);
    return results.rows;
  }

  /*
   * CREATE
   * Creates a new job and returns it's data
   * {job: jobData}
   */

  static async create(params) {
    const query = sqlForInsert("jobs", params);
    try {
      const results = await db.query(query.query, query.values);
      if (!results.rowCount) {
        throw new ExpressError("Invalid parameters", 404);
      }
      return results.rows[0];
    } catch (err) {
      console.error(err);
    }
  }

  /*
   * GET
   * Returns data of one job matching id
   * {job: jobData}
   */

  static async get(id) {
    const results = await db.query(
      `
        SELECT * FROM jobs
        WHERE id = $1`,
      [id]
    );
    const company = await db.query(
      `
          SELECT * FROM companies
          WHERE handle =$1`,
      [results.rows[0].company_handle]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${id} not found`, 404);
    }
    results.rows[0].company = company.rows;
    return results.rows[0];
  }

  /*
   * DELETE
   * Deletes one job matching id
   * {message: "Job deleted"}
   */

  static async delete(id) {
    const results = await db.query(
      `
        DELETE FROM jobs
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${id} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * EDIT
   * Edits a job and returns it's data
   * {job: jobData}
   */

  static async edit(id, items) {
    const query = sqlForPartialUpdate("jobs", items, "id", id);
    const results = await db.query(query.query, query.values);
    if (!results.rowCount) {
      throw new ExpressError(`${id} not found`, 404);
    }
    return results.rows[0];
  }
}

module.exports = Job;
