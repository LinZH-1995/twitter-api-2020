'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Followships', Array.from({ length: 5 }, () => {
      return {
        follower_id: Math.floor(Math.random() * 3) + 1,
        following_id: Math.floor(Math.random() * 3) + 1,
        created_at: new Date(),
        updated_at: new Date()
      }
    }))
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Followships', {})
  }
};
