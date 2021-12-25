const { InternalServerError } = require("../error/errors");

function privilegeRepoFactory(db) {
  const save = async (privilege) => {
    try {
      return db.save(privilege);
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving privilege \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find();

  return { save, getAll };
}

module.exports = privilegeRepoFactory;
