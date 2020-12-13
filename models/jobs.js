const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const db = require("../db");
const sqlForInsert = require("../helpers/insert");

class Company {
  /*
   * CREATE
   * Creates a new job and returns it's data
   * {job: jobData}
   */

  static async create(params) {
    const query = sqlForInsert("jobs", params);
    const results = await db.query(query.query, query.values);
    if (!results.rowCount) {
      throw new ExpressError("Invalid parameters", 404);
    }
    return results.rows[0];
  }
}

module.exports = Company;
