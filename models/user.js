'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');

const User = db.define('user', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            len: { args: [11, 14], msg: 'Nomor telepon tidak valid.' },
            isInt: { args: true, msg: "Nomor telepon harus berupa angka." },
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: true,
        validate: {
            isInt: { args: true, msg: "Usia harus berupa angka." },
        }
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    job: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true,
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
        validate: {
            notEmpty: true,
        }
    },
    is_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        validate: {
            notEmpty: true,
        }
    },
    created_at: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        validate: {
            notEmpty: true,
        }
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    modelName: 'User',
});

module.exports = User;