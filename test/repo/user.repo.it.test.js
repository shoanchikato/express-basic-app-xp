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
      password: "$2a$10$Td1ySyPr9zqMYYXIwWDrk.C0U6Sm2YzpAJuemWfTomV3dRjPIXU3O",
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

  it("should get user by id", async () => {
    const received = await userRepo.getById(1);

    const expected = {
      id: 1,
      name: "name",
      last_name: "last name",
      email: "email@user.com",
    }

    expect(received).toEqual(expected);
  });
  
  it("should get user by email", async () => {
    const received = await userRepo.getUserPasswordByEmail("email@user.com");

    const expected = "$2a$10$Td1ySyPr9zqMYYXIwWDrk.C0U6Sm2YzpAJuemWfTomV3dRjPIXU3O"

    expect(received).toEqual(expected);
  });
});
