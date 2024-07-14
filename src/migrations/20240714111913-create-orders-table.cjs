'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('orders', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			user_name: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			user_number: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			status: {
				type: Sequelize.INTEGER,
				defaultValue: 1,
				allowNull: false,
			},
			products: {
				type: Sequelize.JSON,
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
		await queryInterface.dropTable('orders');
	},
};
