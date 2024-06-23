import { DataTypes } from 'sequelize';
import db from '../connections/connection.db.js';

const Category = db.define(
	'category',
	{
		title_uz: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		title_ru: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		parentId: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'categories', // foreign key bo'lgan jadval nomi
				key: 'id',
			},
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		createdAt: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('createdAt');
			},
		},
		updatedAt: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: () => Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('updatedAt');
			},
		},
	},
	{
		timestamps: true,
		hooks: {
			beforeCreate(category) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				category.createdAt = currentTimestamp;
				category.updatedAt = currentTimestamp;
			},
			beforeUpdate(category) {
				category.updatedAt = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Category;
