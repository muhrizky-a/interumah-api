'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auths', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        allowNull: false,
        unique: true,
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
      token: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auths');
  }
};