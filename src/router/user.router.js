const express = require("express");
const { BadRequestError } = require("../error/errors");
const routerErrorHandler = require("../error/routerErrorHandler");
const router = express.Router();

function userRepoFactory(userRepo, authService) {
  const getIdParam = (reqParams) => {
    const id = parseInt(reqParams.id);

    if (!id) {
      throw new BadRequestError({ message: `invalid user id ${reqParams.id}` });
    }

    return id;
  };

  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const users = await userRepo.getAll();

      res.json(users);
    })
  );

  router.get(
    "/:id",
    routerErrorHandler(async (req, res) => {
      const id = getIdParam(req.params);

      const user = await userRepo.getById(id);

      res.json(user);
    })
  );

  router.post(
    "/",
    routerErrorHandler(async (req, res) => {
      const user = await authService.registerUser(req.body);

      res.status(201).json(user);
    })
  );

  router.delete(
    "/:id",
    routerErrorHandler(async (req, res) => {
      const id = getIdParam(req.params);

      const user = await userRepo.getById(id, req.body);

      await userRepo.deleteOne(id);

      res.json(user);
    })
  );

  router.put(
    "/:id",
    routerErrorHandler(async (req, res) => {
      const id = getIdParam(req.params);

      const user = await userRepo.update(id, req.body);

      res.json(user);
    })
  );

  return router;
}

module.exports = userRepoFactory;
