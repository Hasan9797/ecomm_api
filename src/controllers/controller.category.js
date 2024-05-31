import dataBase from "../models/model.index.js";
const { Category } = dataBase;

export const getAll = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json(categories);
};

export const getById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  res.status(200).json(category);
};

export const create = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

export const update = async (req, res) => {
  const category = await Category.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json(category);
};

export const destroy = async (req, res) => {
  const category = await Category.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json(category);
};
