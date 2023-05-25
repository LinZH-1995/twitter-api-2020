'use strict';

const { faker } = require('@faker-js/faker')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Tweets', Array.from({ length: 10 }, () => {
      return {
        description: faker.lorem.paragraphs(6),
        user_id: Math.floor(Math.random() * 3) + 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Tweets', {})
  }
};
