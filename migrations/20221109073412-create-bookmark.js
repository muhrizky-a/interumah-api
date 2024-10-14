'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bookmarks', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      design_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'designs'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bookmarks');
  }
};