const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../error/errors");

function authTemplateFactory(authService, csrfProtection) {
  router.get("/login", csrfProtection, async (req, res) => {
    console.log(req.session);
    const token = req.csrfToken();
    res.render("login", { csrfToken: token });
  });

  router.post("/login", csrfProtection, async (req, res) => {
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
