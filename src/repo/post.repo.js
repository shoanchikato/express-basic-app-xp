const fetch = require("node-fetch");
const { NotFoundError, InternalServerError } = require("../error/errors");

async function postRepoFactory(db) {
  const postRepo = db.getRepository("Post");

  const save = async (post) => {
    try {
      return await postRepo.save(post);
    } catch (err) {
      throw new InternalServerError(`error occurred saving post \n\n${err}`);
    }
  };

  const getAll = async () => await postRepo.find();

  const getById = async (id) => {
    const post = await postRepo.findOne(id);

    if (!post) throw new NotFoundError(`post with id ${id} not found`);

    return post;
  };

  const deleteOne = async (id) => {
    try {
      return await postRepo.delete(id);
    } catch (err) {
      throw new InternalServerError(`error occurred deleting post \n\n${err}`);
    }
  };

  const update = async (id, post) => {
    const dbpost = await getById(id);

    postRepo.merge(dbpost, post);

    return await postRepo.save(dbpost);
  };

  return { save, getAll, getById, deleteOne, update };
}

module.exports = postRepoFactory;
