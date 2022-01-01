const { InternalServerError } = require("../error/errors");

function roleRepoFactory(db) {
  const save = async (role) => {
    try {
      return db.save(role);
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving role \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find({ relations: ["permissions"] });

  return { save, getAll };
}

module.exports = roleRepoFactory;
