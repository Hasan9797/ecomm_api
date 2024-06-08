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
	},
	{
		timestamps: true,
	}
);

export default Order;
