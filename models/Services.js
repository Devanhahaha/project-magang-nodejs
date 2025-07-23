// models/Services.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Services = sequelize.define('Services', {
  banner: DataTypes.STRING,
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  description: DataTypes.TEXT,
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },  
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'services',
  timestamps: true, // aktifkan kalau ada `created_at`, `updated_at`
});

module.exports = Services;
