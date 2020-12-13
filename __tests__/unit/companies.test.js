process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");
const db = require("../../db");

const sampleComp = {
  handle: "sample",
  name: "The Sample Company",
};
const exampleComp = {
  handle: "example",
  name: "The Example Company",
};

beforeAll(async function () {
  await db.query("DELETE FROM companies");
});

afterEach(async function () {
  await db.query("DELETE FROM companies");
});

afterAll(async function () {
  await db.end();
});
/*
 *
 *Tests GET /Companies route
 *
 */
describe("GET /companies", function () {
  beforeAll(async function () {
    await request(app).post("/companies").send(sampleComp);
    await request(app).post("/companies").send(exampleComp);
  });

  test("Returns all companies", async function () {
    const resp = await request(app).get("/companies");
    expect(resp.status).toEqual(200);
    expect(resp.body.companies).toHaveLength(2);
    expect(resp.body.companies).toEqual(
      expect.arrayContaining([sampleComp, exampleComp])
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
    const resp = await request(app).post("/companies").send(sampleComp);
    expect(resp.status).toEqual(201);
    expect(resp.body).toMatchObject({
      company: {
        handle: "sample",
        name: "The Sample Company",
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
  beforeAll(async function () {
    await request(app).post("/companies").send(sampleComp);
    await request(app).post("/companies").send(exampleComp);
  });

  test("Returns a queried company", async function () {
    const resp1 = await request(app).get(`/companies/${sampleComp.handle}`);
    const resp2 = await request(app).get(`/companies/${exampleComp.handle}`);
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
  beforeEach(async function () {
    await request(app).post("/companies").send(sampleComp);
  });

  test("Completely updates a company", async function () {
    const resp = await request(app)
      .patch(`/companies/${sampleComp.handle}`)
      .send({ num_employees: 888, name: "We sell samples" });
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
      .patch(`/companies/${sampleComp.handle}`)
      .send(newCorp);
    expect(resp.body).toMatchObject({ company: newCorp });
  });
});
/*
 *
 *Tests DELETE /companies/:handle
 *
 */
describe("DELETE /companies/:handle", function () {
  beforeEach(async function () {
    await request(app).post("/companies").send(sampleComp);
  });

  test("Deletes a company", async function () {
    const resp = await request(app).delete(`/companies/${sampleComp.handle}`);
    expect(resp.body).toMatchObject({ message: "Company deleted" });
    expect(resp.status).toEqual(200);
    const checkExists = await request(app).get(
      `/companies/${sampleComp.handle}`
    );
    expect(checkExists.status).toEqual(404);
  });
});
