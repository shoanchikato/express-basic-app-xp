const authServiceFactory = require("../../src/service/auth.service");

const mockUserRepo = {
  save: jest.fn((user) => {
    // remove password field and add id field
    const { password, ...userValue } = { ...user, id: 1 };

    return userValue;
  }),

  getUserPasswordByEmail: jest.fn((username) => {
    return "$2a$10$Td1ySyPr9zqMYYXIwWDrk.C0U6Sm2YzpAJuemWfTomV3dRjPIXU3O";
  }),
};

describe("register user", () => {
  const authService = authServiceFactory(mockUserRepo);

  beforeEach(jest.clearAllMocks);

  it("should return user object without password field", async () => {
    const received = await authService.registerUser({
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
    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
  });

  it("should hash password with 10 salt", async () => {
    await authService.registerUser({
      name: "name",
      last_name: "last name",
      email: "email@user.com",
      password: "password",
    });

    const received = mockUserRepo.save.mock.calls[0][0].password;
    const expected = "$2a$10";

    expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
    expect(received).toContain(expected);
  });

  it("should login user", async () => {
    const received = await authService.loginUser({
      username: "email@user.com",
      password: "password",
    });

    const expected = true;

    expect(mockUserRepo.getUserPasswordByEmail).toHaveBeenCalledTimes(1);
    expect(received).toEqual(expected);
  });
});
