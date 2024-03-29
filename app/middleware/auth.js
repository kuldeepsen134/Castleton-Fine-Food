const jwt = require("jsonwebtoken");



exports.authJWT = async (req, res, next) => {
  const pathArray = ['/api/register', '/api/login', '/api/google', '/api/reset-password', '/api/update-password', '/api/media', '/api/products', '/api/products/:id']
  const dynamicPathRegex = /^\/api\/\w+\/\w+\/?/;

  if (pathArray.includes(req.path) || dynamicPathRegex.test(req.path))
    return next()

  if (req.headers.authorization) {
    try {
      const data = await jwt.verify(req.headers.authorization, process.env.JWT_SECREATE)
      req.user = data;
      return next()

    } catch (error) {

      return res.status(401).send({
        error: true,
        message: 'Unauthorized access!',
      })
    }
  }
  else {
    return res.status(401).send({
      error: true,
      message: 'Unauthorized access!',
    })
  }
}
