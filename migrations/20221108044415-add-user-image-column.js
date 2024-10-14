'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                'users',
                'image',
                {
                    type: Sequelize.TEXT,
                    allowNull: true,
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
            await queryInterface.removeColumn('users', 'image', { transaction });
            await transaction.commit();
        } catch (err) {
            await transaction.rollback();
            throw err;
        }
    }

};