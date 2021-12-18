const express = require("express");
const router = express.Router();

const routerErrorHandler = require("../error/routerErrorHandler");

function postFactoryTemplate(postRepo) {
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

      const n = req.session.views || 0;
      req.session.views = n + 1;
      console.log("session views", req.session.views, req.session.id);

      if (req.session.views > 5) {
        const id = req.session.id;
        console.log(id);
        req.session.destroy();
        res.clearCookie('connect.sid');

      }

      res.render("index", { posts });
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
