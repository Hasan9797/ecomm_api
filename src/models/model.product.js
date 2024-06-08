import { DataTypes } from 'sequelize';
import db from '../connections/connection.db.js';
import productEnum from '../enums/product_enum.js';
const Product = db.define(
	'product',
	{
		title: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		img: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		price: {
			type: DataTypes.BIGINT,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: productEnum.STATUS_CREATE,
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
	}
);

export default Product;
