// models/Calendar.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // sesuaikan path config db

const Calendar = sequelize.define('Calendar', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  label: {
    type: DataTypes.ENUM('business', 'personal', 'holiday'),
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  event_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  guest: {
    type: DataTypes.STRING,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at' // 👈 mapping ke kolom db
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at' // 👈 mapping ke kolom db
  }
}, {
  tableName: 'calendars',
  timestamps: true
});

module.exports = Calendar;
