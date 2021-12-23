const fetch = require("node-fetch");
const { NotFoundError, InternalServerError } = require("../error/errors");

async function postRepoFactory(db) {
  const save = async (post) => {
    try {
      return await db.save(post);
    } catch (err) {
      throw new InternalServerError(`error occurred saving post \n\n${err}`);
    }
  };

  const getAll = async () => await db.find();

  const getById = async (id) => {
    const post = await db.findOne(id);

    if (!post) throw new NotFoundError(`post with id ${id} not found`);

    return post;
  };

  const deleteOne = async (id) => {
    try {
      return await db.delete(id);
    } catch (err) {
      throw new InternalServerError(`error occurred deleting post \n\n${err}`);
    }
  };

  const update = async (id, post) => {
    const dbpost = await getById(id);

    db.merge(dbpost, post);

    return await db.save(dbpost);
  };

  return { save, getAll, getById, deleteOne, update };
}

module.exports = postRepoFactory;
