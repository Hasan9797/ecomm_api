'use strict';
const bcrypt = require('bcrypt');
const userEnum = require('../enums/user_enum');

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
        role: userEnum.default.ROLE_USER_SUPER_ADMIN,
        created_at: Math.floor(Date.now() / 1000),
        updated_at: Math.floor(Date.now() / 1000),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', { login: 'adminJigga' }, {});
  }
};
