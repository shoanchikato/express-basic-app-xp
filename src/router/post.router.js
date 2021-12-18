const express = require("express");
const router = express.Router();

const routerErrorHandler = require("../error/routerErrorHandler");

function postRouterFactory(postRepo) {
  const getIdParam = (reqParams) => {
    const id = parseInt(reqParams.id);

    if (!id) {
      throw new BadRequestError({ message: `invalid post id ${reqParams.id}` });
    }

    return id;
  };

  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const posts = await postRepo.getAll();

      res.json(posts);
    })
  );

  router.get(
    "/:id",
    routerErrorHandler(async (req, res) => {
      const id = getIdParam(req.params);

      const post = await postRepo.getById(id);

      res.json(post);
    })
  );

  return router;
}

module.exports = postRouterFactory;
