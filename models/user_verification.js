'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');

const Verify = db.define('user_verifications', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  register_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  password_token: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  register_otp: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  password_otp: {
    type: DataTypes.STRING(6),
    allowNull: true,
  },
  register_expired_at: {
    allowNull: true,
    type: DataTypes.DATE,
    validate: {
      notEmpty: true,
    }
  },
  password_expired_at: {
    allowNull: true,
    type: DataTypes.DATE,
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


User.hasOne(Verify, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Verify.belongsTo(User);

module.exports = Verify;