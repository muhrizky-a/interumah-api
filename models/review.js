'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Design = require('./design');

const Review = db.define('reviews', {
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
  design_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  designer_rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  design_comments: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  designer_comments: {
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
  modelName: 'reviews',
});

User.hasMany(Review, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});
Review.belongsTo(User, {
  foreignKey: 'customer_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});

Design.hasMany(Review, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});
Review.belongsTo(Design, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE',
  onUpdate: 'SET NULL'
});

module.exports = Review;