import { DataTypes } from 'sequelize';
import db from '../connections/connection.db.js';

const Brand = db.define(
	'brand',
	{
		name_uz: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		name_ru: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		link: {
			type: DataTypes.STRING,
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
			beforeCreate(brand) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				brand.createdAt = currentTimestamp;
				brand.updatedAt = currentTimestamp;
			},
			beforeUpdate(brand) {
				brand.updatedAt = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default Brand;
