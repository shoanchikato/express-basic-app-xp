const permissions = [
  {
    name: "create post",
    base_url: "/api/posts",
    path: "/",
    method: "POST",
    entity: "post",
    action: "create",
  },
  {
    name: "getall post",
    base_url: "/api/posts",
    path: "/",
    method: "GET",
    entity: "post",
    action: "getall",
  },
  {
    name: "getone post",
    base_url: "/api/posts",
    path: "/:id",
    method: "GET",
    entity: "post",
    action: "getone",
  },
];

module.exports = permissions;
