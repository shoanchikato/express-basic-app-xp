const fetch = require("node-fetch");
const express = require("express");
const csrf = require("csurf");

const { PRIVILEGE } = require("../constants");
const dbFactory = require("../db");
const middleware = require("../middleware");
const serverFactory = require("../server");
const postRouterFactory = require("../router/post.router");
const postTemplateFactory = require("../router/post.template");
const authTemplateFactory = require("../router/auth.template");
const userRouterFactory = require("../router/user.router");
const authRouterFactory = require("../router/auth.router");
const postRepoFactory = require("../repo/post.repo");
const userRepoFactory = require("../repo/user.repo");
const authServiceFactory = require("../service/auth.service");
const privilegeRepoFactory = require("../repo/privilege.repo");

async function populatePosts(dbPostRepo) {
  const dbPosts = await dbPostRepo.find();

  if (!dbPosts.length) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = await response.json();
      // console.log(posts);
      await dbPostRepo.save(posts);
    } catch (error) {
      throw new Error(`Error completing http request \n\n${error}`);
    }
  }
}

async function populatePrivilegs(dbPrivilegeRepo) {
  const privileges = await dbPrivilegeRepo.find();

  if (privileges.length) {
    return;
  }

  const values = Object.values(PRIVILEGE).map((value) => ({ name: value }));

  try {
    await dbPrivilegeRepo.save(values);
  } catch (error) {
    throw new Error(`Error setting privileges in the database \n\n${error}`);
  }
}

async function appFactory(dbConnection) {
  // app
  const app = express();

  // database
  const db = await dbFactory(dbConnection);
  const dbPostRepo = db.getRepository("Post");
  const dbUserRepo = db.getRepository("User");
  const dbPrivilegeRepo = db.getRepository("Privilege");

  // repo
  const sessionRepo = await db.getRepository("Session");
  const postRepo = await postRepoFactory(dbPostRepo);
  const userRepo = await userRepoFactory(dbUserRepo);
  const privilegeRepo = await privilegeRepoFactory(dbPrivilegeRepo);

  // populate posts
  await populatePosts(dbPostRepo);
  await populatePrivilegs(dbPrivilegeRepo);

  // middleware
  const { csrfProtection } = middleware({ app, sessionRepo });

  // services
  const authService = authServiceFactory(userRepo);

  // router
  const postRouter = postRouterFactory(postRepo);
  const postTemplate = postTemplateFactory(postRepo);
  const authTemplate = authTemplateFactory(authService, csrfProtection);
  const userRouter = userRouterFactory(userRepo, authService);
  const authRouter = await authRouterFactory(authService);

  const server = serverFactory({
    app,
    postRouter,
    userRouter,
    postTemplate,
    authRouter,
    authTemplate,
  });

  return server;
}

module.exports = appFactory;
