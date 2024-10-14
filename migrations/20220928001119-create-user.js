'use strict';
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            phone: {
                type: Sequelize.STRING,
                allowNull: true,
                validate: {
                    len: { args: [11, 14], msg: 'Nomor telepon tidak valid.' },
                    isInt: { args: true, msg: "Nomor telepon harus berupa angka." },
                }
            },
            age: {
                type: Sequelize.INTEGER,
                allowNull: true,
                validate: {
                    isInt: { args: true, msg: "Usia harus berupa angka." },
                }
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            job: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    notEmpty: true,
                    isEmail: true,
                }
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
                validate: {
                    notEmpty: true,
                }
            },
            role: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'user',
                validate: {
                    notEmpty: true,
                }
            },
            is_verified: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: false,
                validate: {
                    notEmpty: true,
                }
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('users');
    }
};