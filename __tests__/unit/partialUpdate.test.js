process.env.NODE_ENV = "test";
const sqlForPartialUpdate = require("../../helpers/partialUpdate");

describe("partialUpdate()", () => {
  it("should generate a proper partial update query with just 1 field", function () {
    let resp = sqlForPartialUpdate("people", { name: "paige" }, "userId", 4);
    expect(resp.query).toEqual(
      "UPDATE people SET name=$1 WHERE userId=$2 RETURNING *"
    );
    expect(resp.values).toEqual(["paige", 4]);
  });
});
