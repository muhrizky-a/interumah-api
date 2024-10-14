'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'reviews',
        'design_comments',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'reviews',
        'designer_comments',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },
        { transaction }
      );
      await queryInterface.removeColumn('reviews', 'comments', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.addColumn(
        'reviews',
        'comments',
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: true,
          }
        },
        { transaction }
      );
      await queryInterface.removeColumn('reviews', 'design_comments', { transaction });
      await queryInterface.removeColumn('reviews', 'designer_comments', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }
};