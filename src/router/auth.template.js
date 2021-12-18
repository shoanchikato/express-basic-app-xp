const express = require("express");
const router = express.Router();

function authTemplateFactory(userService) {
  router.get("/login", (req, res) => {
    res.render("login");
  });

  return router;
}

module.exports = authTemplateFactory;
