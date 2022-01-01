const express = require("express");
const router = express.Router();
const routerErrorHandler = require("../error/routerErrorHandler");

function actionRouterFactory(actionRepo) {
  router.get(
    "/",
    routerErrorHandler(async (req, res) => {
      const actions = await actionRepo.getAll();
      res.json(actions);
    })
  );

  return router;
}

module.exports = actionRouterFactory;
