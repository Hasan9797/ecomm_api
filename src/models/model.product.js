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

export default Product;
