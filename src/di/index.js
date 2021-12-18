const fetch = require("node-fetch");
const { TypeormStore } = require("connect-typeorm");

const serverFactory = require("../server");
const postRouterFactory = require("../router/post.router");
const postTemplateFactory = require("../router/post.template");
const userRouterFactory = require("../router/user.router");
const authRouterFactory = require("../router/auth.router");
const postRepoFactory = require("../repo/post.repo");
const userRepoFactory = require("../repo/user.repo");
const authServiceFactory = require("../service/auth.service");
const dbFactory = require("../db");

async function appFactory() {
  const db = await dbFactory();

  const sessionRepo = await db.getRepository("Session");
  const postRepo = await postRepoFactory(db);
  const userRepo = await userRepoFactory(db);

  // session storage
  const sessionStore = new TypeormStore({
    cleanupLimit: 2,
    // limitSubquery: false, // If using MariaDB.
    ttl: 86400,
  }).connect(sessionRepo);

  // populate posts
  await populatePosts(postRepo);

  // services
  const authService = authServiceFactory(userRepo);

  // router
  const postRouter = postRouterFactory(postRepo);
  const postTemplate = postTemplateFactory(postRepo);
  const userRouter = userRouterFactory(userRepo);
  const authRouter = await authRouterFactory(authService);

  const server = serverFactory({
    sessionStore,
    postRouter,
    userRouter,
    postTemplate,
    authRouter,
  });

  return server;
}

module.exports = appFactory;

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
