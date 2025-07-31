// models/portofolio_private.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/database'); // sesuaikan dengan lokasi config DB-mu

const PortofolioPrivate = sequelize.define('PortofolioPrivate', {
  nama_pekerjaan: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  bidang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lokasi: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pemberi_jasa_nama: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pemberi_jasa_alamat: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nomor_kontrak: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  tanggal_kontrak: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  nilai_kontrak: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  tanggal_selesai_kontrak: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tanggal_ba_serah_terima: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  tahun_anggaran: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'portofolio_privates',
  schema: 'public',
  timestamps: true,
  createdAt: 'created_at', 
  updatedAt: 'updated_at',   
});

module.exports = PortofolioPrivate;
