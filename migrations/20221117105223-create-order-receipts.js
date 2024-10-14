'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_receipts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      order_id: {
        allowNull: false,
        references: {
          model: {
            tableName: 'orders'
          },
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        type: Sequelize.INTEGER,
      },
      receipt: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      is_valid: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        validate: {
          notEmpty: true,
        }
      },
      comments: {
        type: Sequelize.TEXT,
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
      },
      updated_at: {
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
    await queryInterface.dropTable('order_receipts');
  }
};