import bcrypt from "bcrypt";
import Errors from "../errors/generalError.js";
import userService from "../services/user.service.js";

const getAll = async (req, res, next) => {
  const { page = 1, pageSize = 10, ...filters } = req.query;
  try {
    const users = await userService.getAll(
      parseInt(page),
      parseInt(pageSize),
      filters
    );

    res.status(200).json({ message: "Get users successfully", data: users });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res) => {
  try {
    const user = await userService.getById(req.params.id);

    if (!user) {
      return res.status(200).json({ message: "User not found", data: {} });
    }

    res.status(200).json({ message: "Get user successfully", data: user });
  } catch (error) {
    throw Errors.internal(error.message);
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(200).json({ message: "User not found", data: {} });
    }

    res.status(200).json({ message: "Get user successfully", data: user });
  } catch (error) {
    throw Errors.internal(error.message);
  }
};

const create = async (req, res) => {
  const start = Date.now();
  try {
    const { name, phone, role, login, password, status } = req.body;

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await userService.create({
      name,
      phone,
      role,
      login,
      password: hashPass,
      status,
    });

    const end = Date.now();
    res.status(201).json({
      creating: end - start + "ms",
      message: "User created successfully",
      data: true,
    });
  } catch (error) {
    console.error("Error creating User:", error);
    throw Errors.internal(error.message);
  }
};

const update = async (req, res) => {
  try {
    if (req.body.password) {
      const hashPass = await bcrypt.hash(req.body.password, 10);
      req.body.password = hashPass;
    }

    const user = await userService.update(req.params.id, req.body);

    res.status(200).json({ message: "Updated Successfully", data: user });
  } catch (error) {
    throw Errors.internal(error.message);
  }
};

const distroy = async (req, res) => {
  try {
    await userService.distroy(req.params.id);
    res.status(200).json({ message: "Deleted successfully", data: true });
  } catch (error) {
    throw Errors.internal(error.message);
  }
};

export default { getAll, getById, getMe, create, update, distroy };
