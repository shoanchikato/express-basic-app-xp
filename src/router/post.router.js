const express = require("express");
const router = express.Router();

const routerErrorHandler = require("../error/routerErrorHandler");
const { getIdParam } = require("./shared");

function postRouterFactory(postRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const posts = await postRepo.getAll();
      console.log("req route", req.query, req);

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
