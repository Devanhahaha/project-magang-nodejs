// models/Home.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Home = sequelize.define('Home', {
  banner: DataTypes.STRING,
  title: DataTypes.STRING,
  subtitle: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'homes',
  timestamps: true,
});

module.exports = Home;
