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
  actionRouter,
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
  app.use("/api/actions", actionRouter);
  app.use("/api/roles", roleRouter);

  // templates
  app.set("views", path.join(__dirname, "../views"));
  app.set("view engine", "pug");

  // error handling
  app.use(errorHandler);

  // method not found
  app.use((req, res, next) => {
    res.status(404).send({ error: "method not found" });
  });

  return app;
}

module.exports = serverFactory;
