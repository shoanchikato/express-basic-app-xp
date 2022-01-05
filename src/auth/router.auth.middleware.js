async function routerAuthMiddleware(req, res, next) {
  console.log(req.baseUrl, req.route.path, req.method, req.session.user.permissions);
  next();
}

module.exports = routerAuthMiddleware;
