'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Chat = db.define('chats', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    sender_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    receiver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false,
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
    modelName: 'Verify',
});


User.hasMany(Chat, {
    foreignKey: 'sender_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
User.hasMany(Chat, {
    foreignKey: 'receiver_id',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Chat.belongsTo(User, {
    foreignKey: 'sender_id',
    as: 'sender',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});
Chat.belongsTo(User, {
    foreignKey: 'receiver_id',
    as: 'receiver',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = Chat;