const express = require("express");
const { PERMISSION_STATUS } = require("../constants");
const router = express.Router();
const routerErrorHandler = require("../error/routerErrorHandler");
const { getIdParam } = require("./shared");
const routerAuthMiddleware = require("../auth/router.auth.middleware");

function permissionRouterFactory(permissionRepo) {
  router.get(
    "/",
    routerAuthMiddleware,
    routerErrorHandler(async (req, res) => {
      const permissions = await permissionRepo.getAll();

      res.json(permissions);
    })
  );

  router.post(
    "/",
    routerAuthMiddleware,
    routerErrorHandler(async (req, res) => {
      const permission = req.body;
      const savedPermission = await permissionRepo.save(permission);
      res.json(savedPermission);
    })
  );

  router.get(
    "/:id",
    routerAuthMiddleware,
    routerAuthMiddleware,
    routerErrorHandler(async (req, res) => {
      const id = getIdParam(req.params);

      const permission = await permissionRepo.getById(id);

      return res.json(permission);
    })
  );

  return router;
}

module.exports = permissionRouterFactory;
