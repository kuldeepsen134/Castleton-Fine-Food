const jwt = require("jsonwebtoken");
const { handleError } = require("../utils/helpers");
const { strings } = require("../utils/string");
const { User } = require("../models");
const { config } = require("../config/config");

const { jwtSecrete ,jwtExpiresin} = config

exports.authJWT = async (req, res, next) => {
  const pathArray = ['/api/users/register', '/api/login', '/api/google', '/api/reset-password', '/api/update-password',]

  if (pathArray.includes(req.path))
    return next()

  if (req.headers.authorization) {
    try {
      const data = await jwt.verify(req.headers.authorization, jwtSecrete)
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
  console.log(req?.user);
  if (req?.user?.role === 'admin') {
    return next()
  }
  else {
    handleError(strings.AccessOnlyAdmin, req, res, 0)
    return
  }
}