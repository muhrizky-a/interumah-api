'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Auth = db.define('auths', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    token: {
        type: DataTypes.TEXT,
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
    modelName: 'Auth',
});


User.hasOne(Auth, {
    foreignKey: 'user_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Auth.belongsTo(User);

module.exports = Auth;