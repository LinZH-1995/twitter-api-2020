'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Likes', Array.from({ length: 10 }, () => {
      return {
        user_id: Math.floor(Math.random() * 3) + 1,
        tweet_id: Math.floor(Math.random() * 10) + 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Likes', {})
  }
};
