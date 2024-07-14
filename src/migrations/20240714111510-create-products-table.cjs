'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('products', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			title_uz: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			title_ru: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			code: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			img: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			gallery: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			price: {
				type: Sequelize.FLOAT,
				defaultValue: 0,
				allowNull: true,
			},
			money_type: {
				type: Sequelize.STRING,
				defaultValue: 'usd',
				allowNull: false,
			},
			status: {
				type: Sequelize.INTEGER,
				defaultValue: 0, // `productEnum.STATUS_CREATE` ni joylashtiring
				allowNull: false,
			},
			characteristic: {
				type: Sequelize.JSON,
				allowNull: true,
			},
			description_uz: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			description_ru: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			category_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'categories',
					key: 'id',
				},
			},
			created_at: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},
			updated_at: {
				type: Sequelize.BIGINT,
				allowNull: false,
			},
		});
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.dropTable('products');
	},
};
