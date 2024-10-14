'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Category = require('./category');
// const DesignBudgetPlan = require('./design_budget_plan');

const Design = db.define('designs', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
    },
    user_id: {
        allowNull: false,
        references: {
            model: {
                tableName: 'users'
            },
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        type: DataTypes.INTEGER,
    },
    category_id: {
        allowNull: true,
        references: {
            model: {
                tableName: 'categories'
            },
            key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        type: DataTypes.INTEGER,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    price: {
        allowNull: true,
        type: DataTypes.INTEGER,
    },
    budget_plan: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    modelName: 'Design',
});

User.hasMany(Design, {
    foreignKey: 'user_id',
    onUpdate: 'CASCADE',
    onDelete: 'RESTRICT'
});
Design.belongsTo(User);

Category.hasMany(Design, {
    foreignKey: 'category_id',
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL'
});
Design.belongsTo(Category);

module.exports = Design;