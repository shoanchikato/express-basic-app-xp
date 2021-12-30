const { InternalServerError } = require("../error/errors");

function permissionRepoFactory(db) {
  const save = async (permission) => {
    try {
      return db.save(permission);
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving permission \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find({ relations: ["privileges"] });

  return { save, getAll };
}

module.exports = permissionRepoFactory;
