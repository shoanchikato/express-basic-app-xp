const { InternalServerError } = require("../error/errors");

function permissionRepoFactory(db) {
  const save = async (permission) => {
    try {
      const name = `${permission.action} ${permission.entity}`;
      const newPermission = { name, ...permission };
      return db.save(newPermission);
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving permission \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find();

  const getById = async (id) => await db.findOne(id);

  return { save, getAll, getById };
}

module.exports = permissionRepoFactory;
