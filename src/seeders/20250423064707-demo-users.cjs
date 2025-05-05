'use strict';
const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedPassword = await bcrypt.hash('adminJigga', 10); // Parolni hash qilish
    await queryInterface.bulkInsert('users', [
      {
        name: 'adminJigga',
        phone: '998999893328',
        login: 'adminJigga',
        password: hashedPassword, // Hashlangan parol
        role: 2,
        status: 1,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { login: 'adminJigga' }, {});
  }
};
