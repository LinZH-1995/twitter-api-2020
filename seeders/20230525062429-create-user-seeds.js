'use strict';

const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [
      {
        email: 'root@example.com',
        password: bcrypt.hashSync('123456789', 10),
        name: 'root',
        account: '@root',
        avatar: faker.image.url({ height: 300, width: 300 }),
        introduction: faker.lorem.paragraphs(),
        role: 'admin',
        cover_image: faker.image.url({ height: 600, width: 200 }),
        created_at: new Date(),
        updated_at: new Date()
      }, {
        email: 'user1@example.com',
        password: bcrypt.hashSync('123456789', 10),
        name: 'user1',
        account: '@user1',
        avatar: faker.image.url({ height: 300, width: 300 }),
        introduction: faker.lorem.paragraphs(),
        role: 'user',
        cover_image: faker.image.url({ height: 600, width: 200 }),
        created_at: new Date(),
        updated_at: new Date()
      }, {
        email: 'user2@example.com',
        password: bcrypt.hashSync('123456789', 10),
        name: 'user2',
        account: '@user2',
        avatar: faker.image.url({ height: 300, width: 300 }),
        introduction: faker.lorem.paragraphs(),
        role: 'user',
        cover_image: faker.image.url({ height: 600, width: 200 }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', {})
  }
};
