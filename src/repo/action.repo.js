const { InternalServerError } = require("../error/errors");

function actionRepoFactory(db) {
  const save = async (action) => {
    try {
      return db.save(action);
    } catch (error) {
      throw new InternalServerError(
        `error occurred saving action \n\n${error.stack}`
      );
    }
  };

  const getAll = async () => await db.find({ relations: ["grants"] });

  return { save, getAll };
}

module.exports = actionRepoFactory;
