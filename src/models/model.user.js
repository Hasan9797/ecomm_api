import { DataTypes } from 'sequelize';
import db from '../connections/connection.db.js';

const User = db.define(
	'users',
	{
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
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

export default User;
