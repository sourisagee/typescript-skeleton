'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user1Password = await bcrypt.hash('12345678Qq!', 10);
    const user2Password = await bcrypt.hash('12345678Qq', 10);
    const user3Password = await bcrypt.hash('12345678Qq', 10);

    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'emily',
          email: 'emily@example.com',
          password: user1Password,
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'john',
          email: 'john@example.com',
          password: user2Password,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          username: 'jane',
          email: 'jane@example.com',
          password: user3Password,
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
