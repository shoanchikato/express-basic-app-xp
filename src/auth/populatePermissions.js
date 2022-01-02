async function populatePermissions(dbPermissionRepo) {
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
  try {
    dbPermissionRepo.save(permissions);
  } catch (error) {
    console.log(
      `Error saving permissions at application bootstrap, ${error.stack}`
    );
  }
}

module.exports = populatePermissions;
