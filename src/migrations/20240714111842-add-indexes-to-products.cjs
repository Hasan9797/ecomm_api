'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addIndex('products', ['title_uz']);
		await queryInterface.addIndex('products', ['title_ru']);
		await queryInterface.addIndex('products', ['code']);
		await queryInterface.addIndex('products', ['category_id']);
		await queryInterface.addIndex('products', ['price']);
		await queryInterface.addIndex('products', ['created_at']);
	},

	down: async (queryInterface, Sequelize) => {
		await queryInterface.removeIndex('products', ['title_uz']);
		await queryInterface.removeIndex('products', ['title_ru']);
		await queryInterface.removeIndex('products', ['code']);
		await queryInterface.removeIndex('products', ['category_id']);
		await queryInterface.removeIndex('products', ['price']);
		await queryInterface.removeIndex('products', ['created_at']);
	},
};
