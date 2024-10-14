'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('budget_plans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      design_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'designs'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      volume: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('budget_plans');
  }
};