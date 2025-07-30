// models/Client.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Client = sequelize.define('Client', {
  name: DataTypes.STRING,
  logo: DataTypes.STRING,
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at', // ✅ mapping kolom
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at', // ✅ mapping kolom
  },
}, {
  tableName: 'our__clients', // nama tabel di database
  timestamps: true, 
});

module.exports = Client;
