// models/About.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Component = sequelize.define('Component', {
  logo_apk: DataTypes.STRING,
  nama_apk: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'components',
  timestamps: true, 
});

module.exports = Component;
