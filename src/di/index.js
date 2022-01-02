const fetch = require("node-fetch");
const express = require("express");
const csrf = require("csurf");

const dbFactory = require("../db");
const middleware = require("../middleware");
const serverFactory = require("../server");
// service
const authServiceFactory = require("../service/auth.service");
// repo
const postRepoFactory = require("../repo/post.repo");
const userRepoFactory = require("../repo/user.repo");
const privilegeRepoFactory = require("../repo/privilege.repo");
const permissionRepoFactory = require("../repo/permission.repo");
const roleRepoFactory = require("../repo/role.repo");
// router
const postRouterFactory = require("../router/post.router");
const postTemplateFactory = require("../router/post.template");
const authTemplateFactory = require("../router/auth.template");
const userRouterFactory = require("../router/user.router");
const authRouterFactory = require("../router/auth.router");
const privilegeRouterFactory = require("../router/privilege.router");
const permissionRouterFactory = require("../router/permission.router");
const roleRouterFactory = require("../router/role.router");
const populatePermissions = require("../auth/populatePermissions");

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

async function appFactory(dbConnection) {
  // app
  const app = express();

  // database
  const db = await dbFactory(dbConnection);
  const dbPostRepo = db.getRepository("Post");
  const dbUserRepo = db.getRepository("User");
  const dbPrivilegeRepo = db.getRepository("Privilege");
  const dbPermissionRepo = db.getRepository("Permission");
  const dbRoleRepo = db.getRepository("Role");

  // repo
  const sessionRepo = await db.getRepository("Session");
  const postRepo = await postRepoFactory(dbPostRepo);
  const userRepo = await userRepoFactory(dbUserRepo);
  const privilegeRepo = await privilegeRepoFactory(dbPrivilegeRepo);
  const permissionRepo = await permissionRepoFactory(dbPermissionRepo);
  const roleRepo = await roleRepoFactory(dbRoleRepo);

  // populate database
  // await populatePosts(dbPostRepo);
  await populatePermissions(dbPermissionRepo);

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
  const privilegeRouter = await privilegeRouterFactory(privilegeRepo);
  const permissionRouter = await permissionRouterFactory(permissionRepo);
  const roleRouter = await roleRouterFactory(roleRepo);

  const server = serverFactory({
    app,
    postRouter,
    userRouter,
    postTemplate,
    authRouter,
    authTemplate,
    privilegeRouter,
    permissionRouter,
    roleRouter,
  });

  return server;
}

module.exports = appFactory;
