const express = require("express");
const { APP_SESSION_COOKIE_NAME } = require("../constants");
const router = express.Router();

const routerErrorHandler = require("../error/routerErrorHandler");
const { getIdParam } = require("./shared");

function postFactoryTemplate(postRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const posts = await postRepo.getAll();

      const n = req.session.views || 0;
      req.session.views = n + 1;
      console.log("session views", req.session.views, req.session.id);

      if (req.session.views > 5) {
        const id = req.session.id;
        console.log(id);
        req.session.destroy();
        res.clearCookie(APP_SESSION_COOKIE_NAME);
      }

      res.render("posts", { posts });
    })
  );

  router.get("/:id", async (req, res) => {
    try {
      const id = getIdParam(req.params);

      const post = await postRepo.getById(id);

      res.render("post", { post });
    } catch (err) {
      res.render("post", { error: err });
      console.log(`Error fetching post \n\n${err}`);
    }
  });

  return router;
}

module.exports = postFactoryTemplate;
