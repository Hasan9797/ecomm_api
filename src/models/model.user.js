// src/models/model.user.js
import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../config/connection.db.js';
import userEnum from '../enums/user_enum.js';

class User extends Model {
	static associate(models) { }
}
User.init(
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
			defaultValue: userEnum.ROLE_USER_ADMIN,
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			defaultValue: userEnum.STATUS_INACTIVE,
			allowNull: false,
		},
		login: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		access_token: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		created_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('created_at');
			},
		},
		updated_at: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: Math.floor(Date.now() / 1000),
			get() {
				return this.getDataValue('updated_at');
			},
		},
	},
	{
		sequelize,
		modelName: 'User',
		timestamps: true,
		createdAt: 'created_at', // Rename createdAt to created_at
		updatedAt: 'updated_at', // Rename updatedAt to updated_at
		hooks: {
			beforeCreate(user) {
				const currentTimestamp = Math.floor(Date.now() / 1000);
				user.created_at = currentTimestamp;
				user.updated_at = currentTimestamp;
			},
			beforeUpdate(user) {
				user.updated_at = Math.floor(Date.now() / 1000);
			},
		},
	}
);

export default User;
