const { InternalServerError } = require("../error/errors");

function roleRepoFactory(db) {
  const save = async (role) => {
    try {
      const newRole = await db.save(role);
      return await db.findOne(newRole.id, { relations: ["permissions"] });
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving role \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find({ relations: ["permissions"] });

  const getById = async (id) =>
    await db.findOne(id, { relations: ["permissions"] });

  return { save, getAll, getById };
}

module.exports = roleRepoFactory;
