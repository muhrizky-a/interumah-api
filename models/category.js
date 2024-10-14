'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');

const Category = db.define('categories', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    modelName: 'Category',
});

module.exports = Category;