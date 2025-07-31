// models/About.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');
const Client = require('./Client'); // pastikan Client sudah di-import di atas

const Project = sequelize.define('Project', {
  logo_project: DataTypes.STRING,
  name: DataTypes.STRING,
  title: DataTypes.STRING,
  desc: DataTypes.TEXT,
  status: DataTypes.ENUM('on_progress', 'progress', 'completed'),
  category: DataTypes.ENUM('website', 'mobile'),
  type: DataTypes.ENUM('private', 'public'),
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  client_id: DataTypes.INTEGER,
  developer_id: DataTypes.INTEGER,
  qa_id: DataTypes.INTEGER,
  document_id: DataTypes.INTEGER,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
  },
}, {
  tableName: 'projects',
  timestamps: true,
});

Project.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = Project;
