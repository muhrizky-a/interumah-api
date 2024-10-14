'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const User = require('./user');
const Design = require('./design');

const Bookmark = db.define('bookmarks', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  deleted_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  modelName: 'budget_plans',
});

User.hasMany(Bookmark, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Bookmark.belongsTo(User);

Design.hasMany(Bookmark, {
  foreignKey: 'design_id',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Bookmark.belongsTo(Design);

module.exports = Bookmark;