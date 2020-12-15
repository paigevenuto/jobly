process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../../app");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterAll,
  commonAfterEach,
  adminToken,
  jobIds,
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
describe("GET /jobs", function () {
  test("Returns all jobs", async function () {
    let resp = await request(app).get("/jobs").send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({
      jobs: [{ company_handle: "sample", title: "Software Engineer" }],
    });
  });
});
/*
 *
 *Tests POST /Companies route
 *
 */
describe("POST /jobs", function () {
  test("Makes a new job", async function () {
    const barista = {
      title: "Barista",
      salary: 15000.0,
      equity: 0.01,
      company_handle: "example",
    };
    const resp = await request(app)
      .post("/jobs")
      .send({ ...barista, token: adminToken });
    expect(resp.status).toEqual(201);
    expect(resp.body.job.title).toEqual("Barista");
  });
});
/*
 *
 *Tests GET /jobs/:id route
 *
 */
describe("GET /jobs/:id", function () {
  test("Gets a chosen job", async function () {
    const resp = await request(app)
      .get(`/jobs/${jobIds[0]}`)
      .send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({
      job: {
        id: jobIds[0],
        title: "Software Engineer",
        salary: 90000.0,
        equity: 0.45,
        company_handle: "sample",
        date_posted: expect.any(String),
        company: [
          {
            handle: "sample",
            name: "The Sample Company",
            num_employees: null,
            description: null,
            logo_url: null,
          },
        ],
      },
    });
  });
});
/*
 *
 *Tests PATCH /jobs/:id
 *
 */
describe("PATCH /jobs/:id", function () {
  test("Updates a job", async function () {
    const resp = await request(app).patch(`/jobs/${jobIds[0]}`).send({
      title: "QA Tester",
      salary: 80000,
      token: adminToken,
    });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({
      job: {
        id: jobIds[0],
        title: "QA Tester",
        salary: 80000.0,
        equity: 0.45,
        company_handle: "sample",
        date_posted: expect.any(String),
      },
    });
  });
});
/*
 *
 *Tests DELETE /jobs/:id
 *
 */
describe("DELETE /jobs/:id", function () {
  test("Deletes a job", async function () {
    const resp = await request(app)
      .delete(`/jobs/${jobIds[0]}`)
      .send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({ message: "Job deleted" });
  });
});
