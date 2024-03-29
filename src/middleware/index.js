const compression = require("compression");
const helmet = require("helmet");
const session = require("express-session");
const express = require("express");
const { TypeormStore } = require("connect-typeorm");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

const {
  APP_SESSION_COOKIE_NAME,
  SERVER_SESSION_DURATION,
} = require("../constants");
const appAuthMiddleware = require("../auth/app.auth.middleware");

async function middleware({ app, sessionRepo, roleRepo }) {
  // session storage
  const sessionStore = new TypeormStore({
    cleanupLimit: 2,
    // limitSubquery: false, // If using MariaDB.
    ttl: SERVER_SESSION_DURATION, // seconds
  }).connect(sessionRepo);

  // session management
  const sessionOpt = {
    secret: "keyboard cat",
    name: APP_SESSION_COOKIE_NAME,
    resave: false,
    saveUninitialized: true,
    cookie: {},
    store: sessionStore,
  };

  if (app.get("env") === "production") {
    app.set("trust proxy", 1); // trust first proxy
    sessionOpt.cookie.secure = true; // serve secure cookies
  }

  app.use(session(sessionOpt));

  const csrfProtection = csrf({ cookie: false });

  // express body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // app.use(cookieParser());

  // security
  app.use(helmet());
  app.disable("x-powered-by");

  // compression
  app.use(compression());

  // app auth middleware
  app.use(await appAuthMiddleware(roleRepo));

  return { csrfProtection };
}

module.exports = middleware;
