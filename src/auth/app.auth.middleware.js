async function appAuthMiddleware(roleRepo) {
  return async (req, res, next) => {
    // if user is authenticated and has roles object
    // then get role id and add permissions related
    // to that specific role
    if (req.session.user) {
      const { user } = req.session
      console.log("app.auth.middleware", user);
    }

    next();
  };
}

module.exports = appAuthMiddleware;
