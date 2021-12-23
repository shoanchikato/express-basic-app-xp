const fetch = require("node-fetch");
const express = require("express");
const csrf = require("csurf");

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

async function populatePosts(postRepo) {
  const dbPosts = await postRepo.getAll();

  if (!dbPosts.length) {
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      const posts = await response.json();
      console.log(posts);
      posts.forEach((post) => postRepo.save(post));
    } catch (err) {
      throw new Error(`Error completing http request \n\n${err}`);
    }
  }
}

async function appFactory() {
  // app
  const app = express();

  // database
  const db = await dbFactory();
  const dbPostRepo = db.getRepository("Post");
  const dbUserRepo = db.getRepository("User");

  // repo
  const sessionRepo = await db.getRepository("Session");
  const postRepo = await postRepoFactory(dbPostRepo);
  const userRepo = await userRepoFactory(dbUserRepo);

  // populate posts
  await populatePosts(postRepo);

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
