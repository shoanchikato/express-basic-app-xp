const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
} = require("../error/errors");

function userRepoFactory(db) {
  // NB: if you are using email as the unique identify
  // make sure to first check if the unique identify
  // is already existing in the database and also by
  // setting a constrant in database schema. Finally
  // check for database errors caused by voilating
  // the unique constraint rule
  const save = async (user) => {
    const dbUser = await db
      .createQueryBuilder("user")
      .where("user.email = :email", { email: user.email })
      .getOne();

    if (dbUser) {
      throw new BadRequestError({
        message: `email is ready taken, ${user.email}`,
        reqBody: { email: user.email },
      });
    }

    try {
      return await db.save(user);
    } catch (err) {
      const isDuplicateError = err.message.toLowerCase().includes("unique");
      const isEmail = err.message.toLowerCase().includes("email");

      if (isDuplicateError && isEmail) {
        throw new BadRequestError({
          message: `email is ready taken, ${user.email}`,
          reqBody: { email: user.email },
        });
      } else {
        throw new InternalServerError(`error occurred saving user`);
      }
    }
  };

  const getAll = async () => {
    const users = await db
      .createQueryBuilder("user")
      .select(["user.id", "user.name", "user.last_name", "user.email"])
      .getMany();

    return users;
  };

  const getById = async (id) => {
    const user = await db.findOne(id);

    if (!user) {
      throw new NotFoundError(`user with id ${id} not found`);
    }

    return user;
  };

  const deleteOne = async (id) => {
    try {
      return await db.delete(id);
    } catch (err) {
      throw new InternalServerError(`error occurred deleting user`);
    }
  };

  const update = async (id, user) => {
    const dbUser = await getById(id);

    db.merge(dbUser, user);

    return await db.save(dbUser);
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
