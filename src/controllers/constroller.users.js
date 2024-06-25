import bcrypt from "bcrypt";
import dataBase from "../models/model.index.js";
import Errors from "../errors/generalError.js";
const { User } = dataBase;

const getAll = async (req, res) => {
  try {
    const users = await User.findAll();

    if (users.length <= 0) {
      return res.status(200).json({ message: "No users", data: [] });
    }
    res.status(200).json({ message: "Success", data: users });
  } catch (error) {
    next(Errors.internal(error.message));
  }
};

const getById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(200).json({ message: "User not found", data: {} });
    }
    res.status(200).json({ message: "Get user successfully", data: user });
  } catch (error) {
    console.error("Error fetching user with subcategories:", error);
    next(Errors.internal(error.message));
  }
};

const create = async (req, res) => {
  const start = Date.now();
  try {
    const { name, phone, role, login, password, status } = req.body;

    const hashPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
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
      data: newUser,
    });
  } catch (error) {
    console.error("Error creating User:", error);
    next(Errors.internal(error.message));
  }
};

const update = async (req, res) => {
  try {
    const user = await User.update(req.body, {
      where: { id: req.params.id },
    });

    if (user[0] === 0) {
      return res.status(200).json({ message: "User not fount", data: user });
    }
    res.status(200).json({ message: "Updated Successfully", data: user });
  } catch (error) {
    next(Errors.internal(error.message));
  }
};

const destroy = async (req, res) => {
  try {
    await User.destroy({
      where: { id: req.params.id },
    });
    res.status(200).json({ message: "Deleted successfully", data: true });
  } catch (error) {
    next(Errors.internal(error.message));
  }
};

export default { getAll, getById, create, update, destroy };
