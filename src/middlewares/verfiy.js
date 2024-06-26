import jwt from "jsonwebtoken";
import Errors from "../errors/generalError.js";

// Authentication Middleware
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split("|")[1];
  console.log(token);
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SEC, (err, user) => {
    if (err) return next(Errors.noAuthorization(err));
    req.user = user;
    next();
  });
};

// Authorization Middleware
export const authorizeRolesAdmin = (role) => {
  return (req, res, next) => {
    if (Number(role) !== Number(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};

// Authorization Middleware
export const authorizeRolesSuperAdmin = (role) => {
  return (req, res, next) => {
    if (Number(role) !== Number(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };
};
