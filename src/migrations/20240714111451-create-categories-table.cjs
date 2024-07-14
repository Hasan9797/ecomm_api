'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('categories', {
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
			img: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			parent_id: {
				type: Sequelize.INTEGER,
				allowNull: true,
				references: {
					model: 'categories', // foreign key bo'lgan jadval nomi
					key: 'id',
				},
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
		await queryInterface.dropTable('categories');
	},
};
