/*
 *Generate a generic insert query based on a specified table and request body:
 *
 * - table: where to make the query
 * - items: an object with keys of columns you want to insert and values with
 *          updated values
 *
 *Returns object containing a DB query as a string, and array of
 *string values to be inserted
 */

function sqlForInsert(table, items) {
  let queryKeys = Object.keys(items).join(", ");
  let queryIndexes = [...Array(Object.values(items).length)]
    .map((_, i) => `$${i + 1}`)
    .join(", ");
  let query = `INSERT INTO ${table} (${queryKeys}) VALUES (${queryIndexes}) RETURNING *`;
  let values = Object.values(items);
  return { query, values };
}

module.exports = sqlForInsert;
