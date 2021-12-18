const path = require("path");
const express = require("express");
const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");

const errorHandler = require("../error/erorrHandler");
const { APP_SESSION_COOKIE } = require("../constants");

function serverFactory({
  sessionStore,
  postRouter,
  userRouter,
  postTemplate,
  authRouter,
}) {
  const app = express();

  console.log(new Date().toLocaleString());
  console.log(new Date());
  console.log(Date.now());

  // session management
  const sessionOpt = {
    secret: "keyboard cat",
    name: APP_SESSION_COOKIE,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 10,
    },
    store: sessionStore,
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionOpt.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sessionOpt));

  // security
  app.use(helmet());
  // app.disable("x-powered-by");

  // compression
  app.use(compression());

  // express body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // routes
  app.get("/", (req, res) => {
    res.send("hello world!");
  });

  app.use("/pages", postTemplate);
  app.use("/posts", postRouter);
  app.use("/users", userRouter);
  app.use("/auth", authRouter);

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
