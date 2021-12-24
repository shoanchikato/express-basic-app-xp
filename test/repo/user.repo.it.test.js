const dbFactory = require("../../src/db");
const userRepoFactory = require("../../src/repo/user.repo");
const testDbConnection = require("../db/ormconfig-test");

let db;
let dbUserRepo;
let userRepo;

beforeAll(async () => {
  db = await dbFactory(testDbConnection);
  dbUserRepo = db.getRepository("User");
  userRepo = await userRepoFactory(dbUserRepo);
});

beforeEach(async () => {
  // dbUserRepo.clear()
});

describe("user repository", () => {
  it("should save user", async () => {
    const received = await userRepo.save({
      name: "name",
      last_name: "last name",
      email: "email@user.com",
      password: "password",
    });

    const expected = {
      id: 1,
      name: "name",
      last_name: "last name",
      email: "email@user.com",
    };

    expect(received).toEqual(expected);
  });

  it("should get all users", async () => {
    const received = await userRepo.getAll();

    const expected = [
      {
        id: 1,
        name: "name",
        last_name: "last name",
        email: "email@user.com",
      },
    ];

    expect(received).toEqual(expected);
  });
});
