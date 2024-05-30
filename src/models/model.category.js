import { SequalizeORM } from './connections/connect.js';

const sequelize = SequalizeORM.sequelizeQuery();

export const Category = sequelize.define('User', {
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});
