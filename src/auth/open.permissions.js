const openPermissions = [
  {
    name: "register api",
    base_url: "/api/auth",
    path: "/register",
    method: "POST",
    entity: "user",
    action: "create",
  },
  {
    name: "get register template",
    base_url: "/auth",
    path: "/register",
    method: "GET",
    entity: "user",
    action: "getone",
  },
  {
    name: "post register template",
    base_url: "/auth",
    path: "/register",
    method: "POST",
    entity: "user",
    action: "create",
  },
  {
    name: "login api",
    base_url: "/api/auth",
    path: "/login",
    method: "POST",
    entity: "post",
    action: "create",
  },
  {
    name: "get login template",
    base_url: "/auth",
    path: "/login",
    method: "GET",
    entity: "credentials",
    action: "getone",
  },
  {
    name: "post login template",
    base_url: "/auth",
    path: "/login",
    method: "POST",
    entity: "credentials",
    action: "create",
  },
];

module.exports = openPermissions;
