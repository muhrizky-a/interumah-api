'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('user_verifications', {
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
      register_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      password_token: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      register_otp: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      password_otp: {
        type: Sequelize.STRING(6),
        allowNull: true,
      },
      register_expired_at: {
        allowNull: true,
        type: Sequelize.DATE,
        validate: {
          notEmpty: true,
        }
      },
      password_expired_at: {
        allowNull: true,
        type: Sequelize.DATE,
        validate: {
          notEmpty: true,
        }
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('user_verifications');
  }
};