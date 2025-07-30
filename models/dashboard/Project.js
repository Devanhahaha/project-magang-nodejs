// models/About.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const Project = sequelize.define('Project', {
  logo_project: DataTypes.STRING,
  name: DataTypes.STRING,
  title: DataTypes.STRING,
  desc: DataTypes.TEXT,
  status: DataTypes.ENUM('on_progress', 'progress', 'completed'),
  category: DataTypes.ENUM('website', 'mobile'),
  type: DataTypes.ENUM('private', 'public'),
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'projects',
  timestamps: true, 
});

Project.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = Project;
