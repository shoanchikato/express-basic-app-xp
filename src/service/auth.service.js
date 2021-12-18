const bcrypt = require("bcryptjs");

const { BadRequestError } = require("../error/errors");
const {
  validateUser,
  validateCredentials,
} = require("../validation/auth.validation");

function authServiceFactory(userRepo) {
  const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  };

  const matchPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };

  const registerUser = async (userReqBody) => {
    const { value, error } = await validateUser(userReqBody);

    if (error) {
      const errorMsgs = error.details.map((err) => err.message);
      console.error(errorMsgs);

      throw new BadRequestError({
        message: "error registering user",
        errorMsgs,
      });
    }

    const hash = await generateHash(value.password);

    const newUser = { ...value, password: hash };

    const { password, ...user } = await userRepo.save(newUser);

    return user;
  };

  const loginUser = async (credentials) => {
    const { value, error } = await validateCredentials(credentials);

    if (error) {
      const errorMsgs = error.details.map((err) => err.message);
      console.error(errorMsgs);

      throw new BadRequestError({
        message: "error logging in user",
        validation: errorMsgs,
      });
    }

    const user = await userRepo.getUserHashByEmail(value.username);

    const isPasswordMatch = await matchPassword(
      credentials.password,
      user.password
    );

    return isPasswordMatch;
  };

  return { registerUser, loginUser };
}

module.exports = authServiceFactory;
