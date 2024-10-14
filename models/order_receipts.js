'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Order = require('./orders');

const OrderReceipt = db.define('order_receipts', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  order_id: {
    allowNull: false,
    references: {
      model: {
        tableName: 'orders'
      },
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    type: DataTypes.INTEGER,
  },
  receipt: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  is_valid: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    validate: {
      notEmpty: true,
    }
  },
  comments: {
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
  updated_at: {
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
  modelName: 'order_receipts',
});

Order.hasMany(OrderReceipt, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
OrderReceipt.belongsTo(Order, {
  foreignKey: 'order_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

module.exports = OrderReceipt;