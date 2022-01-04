const bcrypt = require("bcryptjs");

const { BadRequestError } = require("../error/errors");
const {
  validateUser,
  validateCredentials,
} = require("../validation/auth.validation");

function authServiceFactory(userRepo, roleRepo) {
  const generateHash = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    return hash;
  };

  const matchPassword = async (password, hash) => {
    return await bcrypt.compare(password, hash);
  };

  // registerUser
  const registerUser = async (userReqBody) => {
    const { value, error } = await validateUser(userReqBody);

    if (error) {
      const errorMsgs = error.details.map((err) => err.message);
      throw new BadRequestError({
        message: "error registering user",
        validation: errorMsgs,
      });
    }

    const hash = await generateHash(value.password);

    const newUser = { ...value, password: hash };

    const user = await userRepo.save(newUser);

    return user;
  };

  // loginUser
  const loginUser = async (credentials) => {
    const { value, error } = await validateCredentials(credentials);

    if (error) {
      const errorMsgs = error.details.map((err) => err.message);
      console.error(errorMsgs);

      throw new BadRequestError({
        message: "error logging in user",
        validation: errorMsgs,
        reqBody: credentials,
      });
    }

    const user = await userRepo.getUserByEmail(value.username);

    if (!user) {
      // if user username/email is not found
      // wrong credentails were provided
      // NB: to avoid supplying details to hackers in brute
      // force attacks no detailed error message should be
      // provided
      throw new BadRequestError({
        message: "invalid credentials",
      });
    }

    const isPasswordMatch = await matchPassword(
      credentials.password,
      user.password
    );

    return isPasswordMatch;
  };

  return { registerUser, loginUser };
}

module.exports = authServiceFactory;
