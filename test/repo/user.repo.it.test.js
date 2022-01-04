const dbFactory = require("../../src/db");
const userRepoFactory = require("../../src/repo/user.repo");
const testDbConnection = require("../db/ormconfig-test");
const populateDatabase = require("../../src/auth/populate.database");

let db;
let dbUserRepo;
let userRepo;

beforeAll(async () => {
  db = await dbFactory(testDbConnection);
  dbUserRepo = db.getRepository("User");
  userRepo = await userRepoFactory(dbUserRepo);
  await populateDatabase();
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
      role: [{ id: 2 }],
    });

    const expected = {
      id: 1,
      uuid: expect.any(String),
      name: "name",
      last_name: "last name",
      email: "email@user.com",
      role: [
        {
          id: 2,
          name: "user",
        },
      ],
    };

    expect(received).toEqual(expected);
  });

  it("should get all users", async () => {
    const received = await userRepo.getAll();

    const expected = [
      {
        id: 1,
        uuid: expect.any(String),
        name: "name",
        last_name: "last name",
        email: "email@user.com",
        role: [
          {
            id: 2,
            name: "user",
          },
        ],
      },
    ];

    expect(received).toEqual(expected);
  });

  it("should get user by id", async () => {
    const received = await userRepo.getById(1);

    const expected = {
      id: 1,
      uuid: expect.any(String),
      name: "name",
      last_name: "last name",
      email: "email@user.com",
      role: [
        {
          id: 2,
          name: "user",
        },
      ],
    };

    expect(received).toEqual(expected);
  });

  it("should get user by email", async () => {
    const received = await userRepo.getUserByEmail("email@user.com");

    const expected = {
      id: 1,
      uuid: expect.any(String),
      name: "name",
      last_name: "last name",
      email: "email@user.com",
      password: "$2a$10$Td1ySyPr9zqMYYXIwWDrk.C0U6Sm2YzpAJuemWfTomV3dRjPIXU3O",
      role: [
        {
          id: 2,
          name: "user",
        },
      ],
    };

    expect(received).toEqual(expected);
  });

  it("should update user", async () => {
    const received = await userRepo.update(1, {
      name: "new name",
      last_name: "new last name",
      email: "new email@user.com",
      password:
        "new $2a$10$Td1ySyPr9zqMYYXIwWDrk.C0U6Sm2YzpAJuemWfTomV3dRjPIXU3O",
    });

    const expected = {
      id: 1,
      uuid: expect.any(String),
      name: "new name",
      last_name: "new last name",
      email: "new email@user.com",
      role: [
        {
          id: 2,
          name: "user",
        },
      ],
    };

    expect(received).toEqual(expected);
  });

  it("should delete a user", async () => {
    await userRepo.deleteOne(1);
  });
});
