process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterAll,
  commonAfterEach,
  adminToken,
} = require("../../helpers/testCommons");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/*
 *
 *Tests GET /Companies route
 *
 */
describe("GET /companies", function () {
  test("Returns all companies", async function () {
    const resp = await request(app)
      .get("/companies")
      .send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body.companies).toHaveLength(2);
    expect(resp.body.companies).toEqual(
      expect.arrayContaining([
        { handle: "sample", name: "The Sample Company" },
        { handle: "example", name: "The Example Company" },
      ])
    );
  });
});
/*
 *
 *Tests POST /Companies route
 *
 */
describe("POST /companies", function () {
  test("Adds a new company", async function () {
    const resp = await request(app)
      .post("/companies")
      .send({ handle: "testco", name: "The Test Company", token: adminToken });
    expect(resp.status).toEqual(201);
    expect(resp.body).toMatchObject({
      company: {
        handle: "testco",
        name: "The Test Company",
        num_employees: null,
        description: null,
        logo_url: null,
      },
    });
  });
});
/*
 *
 *Tests GET /Companies/:handle route
 *
 */
describe("GET /companies/:handle", function () {
  test("Returns a queried company", async function () {
    const resp1 = await request(app)
      .get("/companies/sample")
      .send({ token: adminToken });
    const resp2 = await request(app)
      .get("/companies/example")
      .send({ token: adminToken });
    expect(resp1.status).toEqual(200);
    expect(resp1.body).toMatchObject({
      company: {
        handle: "sample",
        name: "The Sample Company",
        num_employees: null,
        description: null,
        logo_url: null,
      },
    });
    expect(resp2.body).toMatchObject({
      company: {
        handle: "example",
        name: "The Example Company",
        num_employees: null,
        description: null,
        logo_url: null,
      },
    });
  });
});
/*
 *
 *Tests PATCH /companies/:handle
 *
 */
describe("PATCH /companies/:handle", function () {
  test("Completely updates a company", async function () {
    const resp = await request(app).patch("/companies/sample").send({
      num_employees: 888,
      name: "We sell samples",
      token: adminToken,
    });
    expect(resp.body).toMatchObject({
      company: {
        handle: "sample",
        name: "We sell samples",
        num_employees: 888,
        description: null,
        logo_url: null,
      },
    });
  });

  test("Partially updates a company", async function () {
    const newCorp = {
      handle: "newcorp",
      name: "The New Company",
      num_employees: 888,
      description: "Grand opening",
      logo_url: "http://newcorp.com/logo.png",
    };
    const resp = await request(app)
      .patch("/companies/sample")
      .send({ ...newCorp, token: adminToken });
    expect(resp.body).toMatchObject({ company: newCorp });
  });
});
/*
 *
 *Tests DELETE /companies/:handle
 *
 */
describe("DELETE /companies/:handle", function () {
  test("Deletes a company", async function () {
    const resp = await request(app).delete("/companies/sample").send({
      token: adminToken,
    });
    expect(resp.body).toMatchObject({ message: "Company deleted" });
    expect(resp.status).toEqual(200);
    const checkExists = await request(app)
      .get("/companies/sample")
      .send({ token: adminToken });
    expect(checkExists.status).toEqual(404);
  });
});
