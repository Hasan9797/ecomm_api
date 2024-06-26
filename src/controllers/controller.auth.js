import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dataBase from "../models/model.index.js";
import GeneralError from "../errors/generalError.js";
const { User } = dataBase;

const login = async (req, res) => {
  try {
    const user = await User.findOne({
      login: req.body.login,
    });
    console.log(user);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Wrong login or password", data: false });
    }

    const bcPast = await bcrypt.compare(req.body.password, user.password);
    if (!bcPast) {
      return res.status(401).json({ message: "Wrong password", data: false });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SEC,
      { expiresIn: "6d" }
    );
    res.status(200).json({
      message: "Authorization successfully",
      token: "2|" + accessToken,
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
    const refToken = jwt.sign(
      {
        _id: req.user._id,
        password: req.user.password,
        isAdmin: req.user?.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "6d" }
    );
    res.status(200).json({ refreshToken: refToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

const logout = async (req, res) => {};

export default {
  login,
  refreshToken,
  logout,
};
