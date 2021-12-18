const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} = require("../error/errors");

function userRepoFactory(db) {
  const userRepo = db.getRepository("User");

  const save = async (user) => {
    const dbUser = await userRepo
      .createQueryBuilder("user")
      .where("user.email = :email", { email: user.email })
      .getOne();

    if (dbUser) {
      throw new BadRequestError({
        message: `email is ready taken, ${user.email}`,
      });
    }

    try {
      return await userRepo.save(user);
    } catch (err) {
      const isDuplicateError = err.message.toLowerCase().includes("unique");
      const isEmail = err.message.toLowerCase().includes("email");

      if (isDuplicateError && isEmail) {
        throw new BadRequestError({
          message: `email is ready taken, ${user.email}`,
        });
      } else {
        throw new InternalServerError(`error occurred saving user`);
      }
    }
  };

  const getAll = async () => {
    const users = await userRepo
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.last_name", "user.email"])
      .getMany();

    return users;
  };

  const getById = async (id) => {
    const user = await userRepo.findOne(id);

    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }

    return user;
  };

  const deleteOne = async (id) => {
    try {
      return await userRepo.delete(id);
    } catch (err) {
      throw new InternalServerError(`error occurred deleting user`);
    }
  };

  const update = async (id, user) => {
    const dbUser = await getById(id);

    userRepo.merge(dbUser, user);

    return await userRepo.save(dbUser);
  };

  const getAuthUsername = async (email) => {
    const user = await userRepo
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .select(["user.password"])
      .getOne();

    return user;
  };

  return { save, getAll, getById, deleteOne, update, getAuthUsername };
}

module.exports = userRepoFactory;
