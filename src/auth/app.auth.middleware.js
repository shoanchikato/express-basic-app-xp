async function appAuthMiddleware(roleRepo) {
  return async (req, res, next) => {
    // if user is authenticated and has roles object
    // then get role id and add permissions related
    // to that specific role
    if (req.session.roles) {
      const { id: roleId } = req.session.role;
      const role = await roleRepo.getById(roleId);
      req.permissions = role.permissions;
    }

    next();
  };
}

module.exports = appAuthMiddleware;
