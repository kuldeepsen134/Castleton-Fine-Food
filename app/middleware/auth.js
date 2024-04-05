const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { User } = require("../models");

exports.authJWT = async (req, res, next) => {
  const pathArray = ['/api/users/register', '/api/login', '/api/google', '/api/reset-password', '/api/update-password',]

  if (pathArray.includes(req.path))
    return next()

  if (req.headers.authorization) {
    try {
      const data = await jwt.verify(req.headers.authorization, process.env.JWT_SECREATE)
      const user = await User.findOne({ where: { id: data.id }, attributes: { exclude: ['password', 'token', 'status'] }, })
      req.user = user?.dataValues;
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


exports.authAdmin = async (req, res, next) => {
  if (req?.user?.role === 'admin') {
    return next()
  }
  else {
    handleError(strings.AccessOnlyAdmin, req, res, 0)
    return
  }
}