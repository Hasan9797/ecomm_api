'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('users', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			phone: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			role: {
				type: Sequelize.INTEGER,
				defaultValue: 1,
				allowNull: false,
			},
			status: {
				type: Sequelize.INTEGER,
				defaultValue: 1,
				allowNull: false,
			},
			login: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			password: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			created_at: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: () => Math.floor(Date.now() / 1000),
			},
			updated_at: {
				type: Sequelize.BIGINT,
				allowNull: false,
				defaultValue: () => Math.floor(Date.now() / 1000),
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('users');
	},
};
