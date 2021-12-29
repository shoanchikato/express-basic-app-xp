const express = require("express");
const router = express.Router();
const routerErrorHandler = require("../error/routerErrorHandler");

function privilegeRouterFactory(privilegeRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const privileges = await privilegeRepo.getAll();
      res.json(privileges);
    })
  );

  return router;
}

module.exports = privilegeRouterFactory;
