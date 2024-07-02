import jwt from "jsonwebtoken";
import Errors from "../errors/generalError.js";
import user_enum from "../enums/user_enum.js";
import User from "../models/model.user.js";
// Authentication Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split("|")[1];

  if (!token) {
    return next(Errors.noAuthorization());
  }

  jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
    if (err) {
      return next(Errors.noAuthorization(err));
    }

    User.findByPk(decoded.id)
      .then((user) => {
        if (!user) {
          return next(Errors.noAuthorization());
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        return next(Errors.noAuthorization(err));
      });
  });
};

// Authorization Middleware
export const authorizeRoleAdmin = (req, res, next) => {
  if (Number(req.user.role) !== user_enum.ROLE_USER_ADMIN) {
    return next(Errors.forbeddinError("user role is not Admin"));
  }
  next();
};

// Authorization Middleware
export const authorizeRoleSuperAdmin = (req, res, next) => {
  if (Number(req.user.role) !== user_enum.ROLE_USER_SUPER_ADMIN) {
    return next(Errors.forbeddinError());
  }
  next();
};
