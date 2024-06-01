import dataBase from "../models/model.index.js";
const { User } = dataBase;

export const getAll = async (req, res) => {
  const users = await User.findAll();
  res.status(200).json(users);
};

export const getById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.status(200).json(user);
};

export const create = async (req, res) => {
  const user = await User.create(req.body);
  res.status(201).json(user);
};

export const update = async (req, res) => {
  const user = await User.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json(user);
};

export const destroy = async (req, res) => {
  const user = await User.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json(user);
};
