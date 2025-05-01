import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dataBase from "../models/model.index.js";
import GeneralError from "../errors/generalError.js";
import userService from "../services/service.user.js";
import { generateAccessToken, generateRefreshToken } from "../helpers/jwtHelper.js";

const { User } = dataBase;

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        login: req.body.login,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Wrong login or password", data: false });
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
    const token = req.headers.authorization;
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
