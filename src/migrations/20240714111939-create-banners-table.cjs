'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.createTable('banners', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER,
			},
			name_uz: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			name_ru: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			img: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			link: {
				type: Sequelize.STRING,
				allowNull: true,
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
		await queryInterface.dropTable('banners');
	},
};
