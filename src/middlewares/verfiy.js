import Errors from "../errors/generalError.js";
import user_enum from "../enums/user_enum.js";
import { verifyToken } from "../helpers/jwtHelper.js";
import userService from "../services/user.service.js";

// Authentication Middleware
export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(Errors.noAuthorization());
  }

  try {
    const decode = verifyToken(token);

    const user = await userService.getUserToken(decode.id);

    if (!user) {
      return next(Errors.noAuthorization());
    }
    
    if (user.access_token !== token) {
      return next(Errors.noAuthorization());
    }

    req.user = user;
    next();
  } catch (error) {
    return next(Errors.noAuthorization(error.message));
  }
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
