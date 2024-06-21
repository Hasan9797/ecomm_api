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
			allowNull: true, // Agar `parentId` bo'sh bo'lishi mumkin bo'lsa
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
			get() {
				return this.getDataValue('createdAt');
			},
		},
		updatedAt: {
			type: DataTypes.INTEGER,
			allowNull: false,
			get() {
				return this.getDataValue('updatedAt');
			},
		},
	},
	{
		timestamps: true,
		hooks: {
			beforeCreate(order) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				order.createdAt = currentTimestamp;
				order.updatedAt = currentTimestamp;
			},
			beforeUpdate(order) {
				order.updatedAt = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Category;
