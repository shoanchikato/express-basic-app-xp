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
      const savedUser = await db.save(user);
      const dbUser = await getById(savedUser.id);
      const { password, ...userValue } = dbUser;
      return userValue;
    } catch (err) {
      const isDuplicateError = err.message.toLowerCase().includes("unique");
      const isEmail = err.message.toLowerCase().includes("email");

      if (isDuplicateError && isEmail) {
        throw new BadRequestError({
          message: `email is ready taken, ${user.email}`,
          reqBody: { email: user.email },
        });
      } else {
        throw new InternalServerError(
          `error occurred saving user \n\n${err.stack}`
        );
      }
    }
  };

  const getAll = async () => {
    const users = await db
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .select([
        "user.id",
        "user.uuid",
        "user.name",
        "user.last_name",
        "user.email",
        "role",
      ])
      .getMany();

    return users;
  };

  const getById = async (id) => {
    try {
      const { password, ...user } = await db.findOne(id, {
        relations: ["role"],
      });
      return user;
    } catch (error) {
      throw new NotFoundError(`user with id ${id} not found`);
    }
  };

  const deleteOne = async (id) => {
    getById(id);

    try {
      return await db.delete(id);
    } catch (err) {
      throw new InternalServerError(`error occurred deleting user`);
    }
  };

  const update = async (id, user) => {
    const dbUser = await getById(id);

    db.merge(dbUser, user);

    const { password, ...userValue } = await db.save(dbUser);

    return userValue;
  };

  const getUserByEmail = async (email) => {
    const user = await db
      .createQueryBuilder("user")
      .leftJoinAndSelect("user.role", "role")
      .where("user.email = :email", { email })
      .getOne();

    if (user) {
      return user;
    }

    return null;
  };

  return { save, getAll, getById, deleteOne, update, getUserByEmail };
}

module.exports = userRepoFactory;
