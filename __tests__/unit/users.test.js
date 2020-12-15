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
describe("GET /users", function () {
  test("Returns all users", async function () {
    let resp = await request(app).get("/users");
    expect(resp.status).toEqual(200);

    expect(resp.body).toMatchObject({
      users: [
        {
          username: "admin",
          first_name: "Admin",
          last_name: "Admin",
          email: "admin@mail.com",
        },
        {
          username: "janes",
          first_name: "Jane",
          last_name: "Smith",
          email: "jane@mail.com",
        },
      ],
    });
  });
});
/*
 *
 *Tests POST /Companies route
 *
 */
describe("POST /users", function () {
  test("Creates a new user", async function () {
    const resp = await request(app).post("/users").send({
      username: "johns",
      password: "password",
      first_name: "John",
      last_name: "Smith",
      email: "john@mail.com",
    });
    expect(resp.status).toEqual(201);
    expect(resp.body).toMatchObject({
      token: expect.any(String),
    });
  });
});
/*
 *
 *Tests GET /users/:username route
 *
 */
describe("GET /users/:username", function () {
  test("Gets a chosen user", async function () {
    const resp = await request(app)
      .get("/users/janes")
      .send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({
      user: {
        username: "janes",
        first_name: "Jane",
        last_name: "Smith",
        email: "jane@mail.com",
        photo_url: null,
        is_admin: false,
      },
    });
  });
});
/*
 *
 *Tests PATCH /users/:username
 *
 */
describe("PATCH /users/:username", function () {
  test("Updates a user", async function () {
    const resp = await request(app).patch("/users/admin").send({
      username: "superadmin",
      first_name: "super",
      last_name: "admin",
      token: adminToken,
    });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({
      user: {
        username: "superadmin",
        first_name: "super",
        last_name: "admin",
        email: "admin@mail.com",
        is_admin: true,
        photo_url: null,
      },
    });
  });
});
/*
 *
 *Tests DELETE /users/:username
 *
 */
describe("DELETE /users/:username", function () {
  test("Deletes a user", async function () {
    let resp = await request(app)
      .delete("/users/admin")
      .send({ token: adminToken });
    expect(resp.status).toEqual(200);
    expect(resp.body).toMatchObject({ message: "User deleted" });
  });
});
