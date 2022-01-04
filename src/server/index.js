const path = require("path");

const errorHandler = require("../error/erorrHandler");

function serverFactory({
  app,
  postRouter,
  userRouter,
  postTemplate,
  authRouter,
  authTemplate,
  privilegeRouter,
  permissionRouter,
  roleRouter,
}) {
  // routes
  app.get("/", (req, res) => {
    res.send("hello world!");
  });

  app.use("/posts", postTemplate);
  app.use("/auth", authTemplate);
  app.use("/api/posts", postRouter);
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);
  app.use("/api/privileges", privilegeRouter);
  app.use("/api/permissions", permissionRouter);
  app.use("/api/roles", roleRouter);

  // templates
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  // error handling
  app.use(errorHandler);

  // method not found
  // link: http://expressjs.com/en/api.html#res.format
  // If the header is not specified, the first callback is invoked.
  app.use((req, res, next) => {
    // res.status(404).send({ error: "method not found" });
    res.status(404).format({
      json: function () {
        res.send({ error: "method not found" });
      },

      html: function () {
        res.send("<h1>method not found</h1>");
      },

      text: function () {
        res.send("method not found");
      },
    });
  });

  return app;
}

module.exports = serverFactory;
