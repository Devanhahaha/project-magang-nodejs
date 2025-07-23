const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ModelHasRole = sequelize.define('model_has_roles', {
  role_id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  },
  model_type: {
    type: DataTypes.STRING,
    primaryKey: true,
    defaultValue: 'App\\Models\\User' // ⬅️ Default supaya tidak NULL
  },
  model_id: {
    type: DataTypes.BIGINT,
    primaryKey: true
  }
}, {
  tableName: 'model_has_roles',
  timestamps: false
});

module.exports = ModelHasRole;
