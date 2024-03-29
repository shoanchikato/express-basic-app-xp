const express = require("express");
const routerAuthMiddleware = require("../auth/router.auth.middleware");
const { BadRequestError } = require("../error/errors");
const routerErrorHandler = require("../error/routerErrorHandler");
const { getIdParam } = require("./shared");
const router = express.Router();

function userRouterFactory(userRepo, authService) {
  router.get(
    "/",
    routerAuthMiddleware,
    routerErrorHandler(async (req, res) => {
      const users = await userRepo.getAll();

      res.json(users);
    })
  );

  router.get(
    "/:id",
    routerAuthMiddleware,
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

module.exports = userRouterFactory;
