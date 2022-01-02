async function routerAuthMiddleware(req, res, next) {
  console.log(req.baseUrl, req.route.path, req.method);
  next();
}

module.exports = routerAuthMiddleware;
