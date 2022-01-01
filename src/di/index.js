const fetch = require("node-fetch");
const express = require("express");
const csrf = require("csurf");

const { ACTION } = require("../constants");
const dbFactory = require("../db");
const middleware = require("../middleware");
const serverFactory = require("../server");
// service
const authServiceFactory = require("../service/auth.service");
// repo
const postRepoFactory = require("../repo/post.repo");
const userRepoFactory = require("../repo/user.repo");
const privilegeRepoFactory = require("../repo/privilege.repo");
const actionRepoFactory = require("../repo/action.repo");
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
const actionRouterFactory = require("../router/action.router");
const roleRouterFactory = require("../router/role.router");

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

async function populatePermissions(dbPermissionRepo) {
  const permissions = [
    {
      name: "create posts",
      base_url: "/api/posts",
      path: "/",
      method: "POST",
      entity: "post",
      action: [
        {
          id: 1,
        },
      ],
    },
    {
      name: "get all posts",
      base_url: "/api/posts",
      path: "/",
      method: "POST",
      entity: "post",
      action: [
        {
          id: 2,
          name: "getall",
        },
      ],
    },
    {
      name: "get individual post",
      base_url: "/api/posts",
      path: "/:id",
      method: "POST",
      entity: "post",
      action: [
        {
          id: 3,
          name: "getone",
        },
      ],
    },
  ];
  try {
    dbPermissionRepo.save(permissions);
  } catch (error) {}
}

async function populateAction(dbActionRepo) {
  const privileges = await dbActionRepo.find();

  if (privileges.length) {
    return;
  }

  const values = Object.values(ACTION).map((value) => ({ name: value }));

  try {
    await dbActionRepo.save(values);
  } catch (error) {
    throw new Error(`Error setting actions in the database \n\n${error}`);
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
  const dbActionRepo = db.getRepository("Action");
  const dbRoleRepo = db.getRepository("Role");

  // repo
  const sessionRepo = await db.getRepository("Session");
  const postRepo = await postRepoFactory(dbPostRepo);
  const userRepo = await userRepoFactory(dbUserRepo);
  const privilegeRepo = await privilegeRepoFactory(dbPrivilegeRepo);
  const permissionRepo = await permissionRepoFactory(dbPermissionRepo);
  const actionRepo = await actionRepoFactory(dbActionRepo);
  const roleRepo = await roleRepoFactory(dbRoleRepo);

  // populate database
  await populatePosts(dbPostRepo);
  await populateAction(dbActionRepo);
  await populatePermissions(dbPermissionRepo)

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
  const actionRouter = await actionRouterFactory(actionRepo);
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
    actionRouter,
    roleRouter,
  });

  return server;
}

module.exports = appFactory;
