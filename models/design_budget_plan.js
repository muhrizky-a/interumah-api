'use strict';
const db = require('../config/database');
const { DataTypes } = require('sequelize');
const Design = require('./design');

const DesignBudgetPlan = db.define('budget_plans', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  design_id: {
    allowNull: false,
    references: {
      model: {
        tableName: 'designs'
      },
      key: 'id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  volume: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    }
  },
  cost: {
    type: DataTypes.FLOAT,
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
  modelName: 'budget_plans',
});

Design.hasMany(DesignBudgetPlan);
DesignBudgetPlan.belongsTo(Design);

module.exports = DesignBudgetPlan;