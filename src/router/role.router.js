const express = require("express");
const { PERMISSION_STATUS } = require("../constants");
const router = express.Router();
const routerErrorHandler = require("../error/routerErrorHandler");

function roleRouterFactory(roleRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const roles = await roleRepo.getAll();
      res.json(roles);
    })
  );

  router.post(
    "/",
    routerErrorHandler(async (req, res) => {
      const role = req.body;
      const savedRole = await roleRepo.save(role);
      res.json(savedRole);
    })
  );

  return router;
}

module.exports = roleRouterFactory;
