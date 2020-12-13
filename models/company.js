const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const db = require("../db");
const sqlForInsert = require("../helpers/insert");

/** Company class for Jobly
 * {companies: [companyData, ...]} */

class Company {
  /*
   * ALL
   * Returns handle and name of all companies matching parameters
   * {companies: [companyData, ...]}
   */

  static async all(params) {
    // Prepares values from parameters

    const paramValues = { ...params };
    if (paramValues.search) paramValues.search = `%${paramValues.search}%`;

    // Templates for generating query

    let baseQuery = `SELECT handle, name FROM companies`;
    const clauseTemplates = {
      min_employees: "num_employees >= $",
      max_employees: "num_employees <= $",
      search: "name ILIKE $",
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
   * Creates a new company and returns it's data
   * {company: companyData}
   */

  static async create(params) {
    const query = sqlForInsert("companies", params);
    const results = await db.query(query.query, query.values);
    if (!results.rowCount) {
      throw new ExpressError("Invalid parameters", 404);
    }
    return results.rows[0];
  }

  /*
   * GET
   * Returns data of one company matching handle
   * {company: companyData}
   */

  static async get(handle) {
    const results = await db.query(
      `
        SELECT * FROM companies
        WHERE handle = $1`,
      [handle]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${handle} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * DELETE
   * Deletes one company matching handle
   * {message: "Company deleted"}
   */

  static async delete(handle) {
    const results = await db.query(
      `
        DELETE FROM companies
        WHERE handle = $1
        RETURNING handle`,
      [handle]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${handle} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * EDIT
   * Edits a company and returns it's data
   * {company: companyData}
   */

  static async edit(handle, items) {
    const query = sqlForPartialUpdate("companies", items, "handle", handle);
    const results = await db.query(query.query, query.values);
    if (!results.rowCount) {
      throw new ExpressError(`${handle} not found`, 404);
    }
    return results.rows[0];
  }
}

module.exports = Company;
