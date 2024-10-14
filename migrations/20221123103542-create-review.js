'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        allowNull: true,
        references: {
          model: {
            tableName: 'users'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        type: Sequelize.INTEGER,
      },
      design_id: {
        allowNull: true,
        references: {
          model: {
            tableName: 'designs'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        type: Sequelize.INTEGER,
      },
      design_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      designer_rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
        validate: {
          notEmpty: true,
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reviews');
  }
};