const authServiceFactory = require("../../src/service/auth.service");

const mockUserRepo = {
  save: jest.fn((user) => ({ ...user, id: 1 })),
}

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
});
