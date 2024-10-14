'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('categories', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('categories');
    }
};