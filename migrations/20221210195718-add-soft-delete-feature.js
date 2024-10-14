'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'users', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'auths', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'categories', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'designs', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'budget_plans', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'user_verifications', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'chats', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'bookmarks', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'orders', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'order_receipts', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'reviews', 'deleted_at',
        {
          type: Sequelize.DATE,
          allowNull: true
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeColumn('users', 'deleted_at', { transaction });
      await queryInterface.removeColumn('auths', 'deleted_at', { transaction });
      await queryInterface.removeColumn('categories', 'deleted_at', { transaction });
      await queryInterface.removeColumn('designs', 'deleted_at', { transaction });
      await queryInterface.removeColumn('budget_plans', 'deleted_at', { transaction });
      await queryInterface.removeColumn('user_verifications', 'deleted_at', { transaction });
      await queryInterface.removeColumn('chats', 'deleted_at', { transaction });
      await queryInterface.removeColumn('bookmarks', 'deleted_at', { transaction });
      await queryInterface.removeColumn('orders', 'deleted_at', { transaction });
      await queryInterface.removeColumn('order_receipts', 'deleted_at', { transaction });
      await queryInterface.removeColumn('reviews', 'deleted_at', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};