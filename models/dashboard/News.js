// models/News.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./User');

const News = sequelize.define('News', {
  image: DataTypes.STRING,
  category: DataTypes.STRING,
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  tanggal: DataTypes.DATE,
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
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },  
}, {
  tableName: 'news',
  timestamps: true, // aktifkan kalau ada `created_at`, `updated_at`
});

News.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'author', // alias untuk user pembuat
});

module.exports = News;
