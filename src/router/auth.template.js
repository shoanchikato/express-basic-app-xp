const express = require("express");
const router = express.Router();

const { BadRequestError } = require("../error/errors");

function authTemplateFactory(authService, csrfProtection) {
  // get registration
  router.get("/register", csrfProtection, async (req, res) => {
    const csrfToken = req.csrfToken();
    res.render("register", { csrfToken });
  });

  // post registration
  router.post("/register", csrfProtection, async (req, res) => {
    const csrfToken = req.csrfToken();
    const registrationDetails = req.body;
    console.log(registrationDetails);

    try {
      await authService.registerUser(req.body);
      res.redirect("/auth/login");
    } catch (error) {
      console.log(error);
      res.render("register", { error: error, csrfToken });
    }
  });

  // get login
  router.get("/login", csrfProtection, async (req, res) => {
    const csrfToken = req.csrfToken();
    res.render("login", { csrfToken });
  });

  // post login
  router.post("/login", csrfProtection, async (req, res) => {
    const csrfToken = req.csrfToken();
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
    } catch (error) {
      // catch errors from both service and
      // invalid login
      res.render("login", { error, csrfToken });
      console.error(error);
    }
  });

  return router;
}

module.exports = authTemplateFactory;
