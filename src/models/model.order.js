import { DataTypes } from 'sequelize';
import db from '../connections/connection.db.js';
import orderEnum from '../enums/order_enum.js';

const Order = db.define(
	'order',
	{
		user_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		user_number: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: orderEnum.STATUS_CREATE,
			allowNull: false,
		},
		products: {
			type: DataTypes.JSON,
			allowNull: false,
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

export default Order;
