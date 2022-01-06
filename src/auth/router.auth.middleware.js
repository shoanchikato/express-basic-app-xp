const openPermissions = require("./open.permissions");

const hasPermission = (permissions, req) => {
  const permissionFound = permissions?.find(
    (permission) =>
      permission.base_url === req.baseUrl &&
      permission.method === req.method &&
      permission.path === req.route.path
  );

  return permissionFound;
};

async function routerAuthMiddleware(req, res, next) {
  console.log(
    req.baseUrl,
    req.route.path,
    req.method,
    req?.session?.user?.permissions
  );

  const permissions = req?.session?.user?.permissions;

  // check if the route is open
  const isOpen = hasPermission(openPermissions, req);

  if (isOpen) {
    console.log("is an open route", req.route.baseUrl);
    next();
    return;
  }

  // check if the user has the correct permissions
  // to access the route/resource
  const currentPermission = hasPermission(permissions, req);

  if (currentPermission) {
    console.log("current permission is present", currentPermission);
  } else {
    res.status(403).format({
      json: () => {
        res.json({ error: "not authorized" });
      },

      html: () => {
        res.redirect("/auth/login");
      },

      text: () => {
        res.redirect("/auth/login");
      },
    });
    console.log("there is no matching permission");
    return;
  }

  next();
}

module.exports = routerAuthMiddleware;
