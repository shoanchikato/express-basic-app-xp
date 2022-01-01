const express = require("express");
const { PERMISSION_STATUS } = require("../constants");
const router = express.Router();
const routerErrorHandler = require("../error/routerErrorHandler");

function permissionRouterFactory(permissionRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const permissions = await permissionRepo.getAll();
      
      res.json(permissions);
    })
  );

  router.post(
    "/",
    routerErrorHandler(async (req, res) => {
      const permission = req.body;
      const savedPermission = await permissionRepo.save(permission);
      res.json(savedPermission);
    })
  );

  return router;
}

module.exports = permissionRouterFactory;
