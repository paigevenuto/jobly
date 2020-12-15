const ExpressError = require("../helpers/expressError");
const sqlForPartialUpdate = require("../helpers/partialUpdate");
const db = require("../db");
const sqlForInsert = require("../helpers/insert");
const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");

class User {
  /*
   * ALL
   * Returns handle and name of all users matching parameters
   * {users: [companyData, ...]}
   */

  static async all(params) {
    const results = await db.query(
      `
        SELECT username, first_name, last_name, email
        FROM users`
    );
    return results.rows;
  }

  /*
   * CREATE
   * Creates a new users and returns it's data
   * {users: usersData}
   */

  static async create(params) {
    let paramsCopy = { ...params };
    const hashedPass = await bcrypt.hash(
      paramsCopy.password,
      BCRYPT_WORK_FACTOR
    );
    paramsCopy.password = hashedPass;
    const query = sqlForInsert("users", paramsCopy);
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
   * Returns data of one users matching username
   * {users: usersData}
   */

  static async get(username) {
    const results = await db.query(
      `
        SELECT username, first_name, last_name, email, photo_url, is_admin
        FROM users
        WHERE username = $1`,
      [username]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${username} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * DELETE
   * Deletes one users matching username
   * {message: "User deleted"}
   */

  static async delete(username) {
    const results = await db.query(
      `
        DELETE FROM users
        WHERE username = $1
        RETURNING username, first_name, last_name, email, photo_url, is_admin`,
      [username]
    );
    if (!results.rowCount) {
      throw new ExpressError(`${username} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * EDIT
   * Edits a users and returns it's data
   * {users: usersData}
   */

  static async edit(username, items) {
    const query = sqlForPartialUpdate("users", items, "username", username);
    const results = await db.query(query.query, query.values);
    if (!results.rowCount) {
      throw new ExpressError(`${username} not found`, 404);
    }
    return results.rows[0];
  }

  /*
   * AUTHENTICATE
   * Is this username/password valid?
   * Returns boolean.
   */

  static async authenticate(username, password) {
    let hashed_pass = await db.query(
      `
            SELECT password FROM users
            WHERE username=$1
            `,
      [username]
    );
    return await bcrypt.compare(password, hashed_pass.rows[0].password);
  }
}

module.exports = User;
