const request = require("supertest");
const appFactory = require("../../src/di");
const testDbConnection = require("../db/ormconfig-test");

let app;

beforeEach(async () => {
  app = await appFactory(testDbConnection);
});

describe("post template route", () => {
  it("should render posts html page", async () => {
    const response = await request(app).get("/posts").expect(403);
  });
});
