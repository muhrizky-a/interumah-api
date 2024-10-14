'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('designs', {
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
        onDelete: 'RESTRICT',
        type: Sequelize.INTEGER,
      },
      category_id: {
        allowNull: true,
        references: {
          model: {
            tableName: 'categories'
          },
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      area: {
        type: Sequelize.FLOAT,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
      image: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('designs');
  }
};