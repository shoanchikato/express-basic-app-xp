const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../error/errors");

function authTemplateFactory(authService) {
  router.get("/login", async (req, res) => {
    res.render("login");
  });

  router.post("/login", async (req, res) => {
    const credentials = req.body;

    try {
      const isPasswordMatch = await authService.loginUser(credentials);

      if (isPasswordMatch) {
        // on successful login
        req.session.isAuthenticated = true;

        res.redirect("/posts");
      } else {
        // on failure to login
        throw new BadRequestError({
          message: "invalid credentails",
          reqBody: req.body,
        });
      }
    } catch (err) {
      // catch errors from both service and
      // invalid login
      res.render("login", { error: err });
      console.error(err);
    }
  });

  return router;
}

module.exports = authTemplateFactory;
