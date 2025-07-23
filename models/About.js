// models/About.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const About = sequelize.define('About', {
  image: DataTypes.STRING,
  description: DataTypes.TEXT,
  vision: DataTypes.TEXT,
  mission: DataTypes.TEXT,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'abouts',
  timestamps: true, 
});

module.exports = About;
