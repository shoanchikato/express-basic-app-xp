const express = require("express");
const router = express.Router();

const routerErrorHandler = require("../error/routerErrorHandler");
const { BadRequestError } = require("../error/errors");

async function authRouterFactory(authService) {
  router.post(
    "/register",
    routerErrorHandler(async (req, res) => {
      const userReqBody = req.body;

      const user = await authService.registerUser(userReqBody);

      res.status(201).json(user);
    })
  );

  router.post(
    "/login",
    routerErrorHandler(async (req, res) => {
      const credentials = req.body;

      const isPasswordMatch = await authService.loginUser(credentials);

      if (isPasswordMatch) {
        req.session.isAuthenticated = true;

        res.send("login success");
      } else {
        req.session.destroy();

        throw new BadRequestError({
          message: "invalid credentails",
          reqBody: req.body,
        });
      }
    })
  );

  return router;
}

module.exports = authRouterFactory;
