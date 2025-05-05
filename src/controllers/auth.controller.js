import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dataBase from "../models/model.index.js";
import GeneralError from "../errors/generalError.js";
import userService from "../services/user.service.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwtHelper.js";
import userEnum from "../enums/user_enum.js";

const { User } = dataBase;

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        login: req.body.login,
      },
    });

    if (!user && user?.status != userEnum.STATUS_ACTIVE) {
      return res
        .status(401)
        .json({ message: "Wrong login password or user inactive", data: false });
    }

    const bcPast = await bcrypt.compare(req.body.password, user.password);
    if (!bcPast) {
      return res.status(401).json({ message: "Wrong password", data: false });
    }

    const accessToken = generateAccessToken(
      {
        id: user.id,
        role: user.role,
      });

    await userService.update(user.id, { access_token: accessToken });

    res.status(200).json({
      message: "Authorization successfully",
      token: accessToken,
    });
  } catch (err) {
    throw new Error(err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const token = req.body.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        if (err) {
          throw GeneralError.noAuthorization();
        }
        req.user = user;
      });
    }
    const refToken = generateRefreshToken(
      {
        id: req.user.id,
        role: req.user.role,
      },
    );
    res.status(200).json({ refreshToken: refToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const user = await userService.getByAccessToken(token);
    await userService.update(user.id, { access_token: null });

    res.status(200).json({ message: "Logout successfully", data: true });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export default {
  login,
  refreshToken,
  logout,
};
