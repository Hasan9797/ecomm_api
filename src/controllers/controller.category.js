import dataBase from "../models/model.index.js";
const { Category } = dataBase;

const getAll = async (req, res) => {
  const categories = await Category.findAll();
  res.status(200).json(categories);
};

const getById = async (req, res) => {
  const category = await Category.findByPk(req.params.id);
  res.status(200).json(category);
};

const create = async (req, res) => {
  const category = await Category.create(req.body);
  res.status(201).json(category);
};

const update = async (req, res) => {
  const category = await Category.update(req.body, {
    where: { id: req.params.id },
  });
  res.status(200).json(category);
};

const destroy = async (req, res) => {
  const category = await Category.destroy({
    where: { id: req.params.id },
  });
  res.status(200).json(category);
};

export default { getAll, getById, create, update, destroy };
