'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Design = require('./design');

const Order = db.define('orders', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  customer_id: {
    allowNull: true,
    references: {
      model: {
        tableName: 'users'
      },
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    type: DataTypes.INTEGER,
  },
  design_id: {
    allowNull: true,
    references: {
      model: {
        tableName: 'designs'
      },
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    type: DataTypes.INTEGER,
  },
  price: {
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  status: {
    type: DataTypes.STRING,
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
  modelName: 'orders',
});

User.hasMany(Order, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});
Order.belongsTo(User, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});

Design.hasMany(Order, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});
Order.belongsTo(Design);

module.exports = Order;