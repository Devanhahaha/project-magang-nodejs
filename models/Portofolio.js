// models/Portofolio.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portofolio = sequelize.define('Portofolio', {
  image: DataTypes.STRING,
  category: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  tanggal: DataTypes.DATE,
  end_date: DataTypes.DATE,
  techstack: DataTypes.TEXT,
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
  tableName: 'portofolios',
  timestamps: true, // aktifkan kalau ada `created_at`, `updated_at`
});

module.exports = Portofolio;
