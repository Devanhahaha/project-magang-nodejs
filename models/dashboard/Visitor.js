const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

const Visitor = sequelize.define('Visitor', {
  ip_address: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  visited_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'visitors',
  timestamps: false
});

module.exports = Visitor;
