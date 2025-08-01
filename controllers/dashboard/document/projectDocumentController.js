const Project = require('../../../models/dashboard/Project');
const User = require('../../../models/dashboard/User');
const Role = require('../../../models/dashboard/Role');
const Client = require('../../../models/dashboard/Client');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

function stripHTML(input) {
    return input.replace(/<[^>]*>?/gm, '');
}

exports.index = async (req, res) => {
    try {
      const userLoginId = req.session.user.id; // Ambil user ID dari sesi login
  
      const projects = await Project.findAll({
        where: {
          document_id: userLoginId // ⬅️ Filter hanya project milik developer ini
        },
        include: [
          { model: User, as: 'admin' },
          { model: User, as: 'developer' },
          { model: User, as: 'qa' },
          { model: User, as: 'document' },
          { model: Client, as: 'client' },
        ],
        order: [['createdAt', 'DESC']],
      });
  
      const projectWithPreview = projects.map((item) => {
        const formatTanggal = (tgl) =>
          tgl ? new Date(tgl).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
          }) : '-';
        return {
          ...item.toJSON(),
          descPreview: stripHTML(item.desc),
          ...item.dataValues,
          start_date: formatTanggal(item.start_date),
          end_date: formatTanggal(item.end_date),
          ba_serah_terima: formatTanggal(item.ba_serah_terima),
        };
      });
  
      res.render('dashboard/documentpage/project/index', {
        title: 'Projects',
        projects: projectWithPreview,
        layout: 'dashboard/documentpage/layouts/main',
      });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error.');
    }
};  

exports.showByName = async (req, res) => {
  try {
    const rawName = req.params.name;
    const name = decodeURIComponent(rawName); // ⬅️ Tambahkan ini
    
    const clients = await Client.findAll();

    const project = await Project.findOne({
      include: [
        { model: User, as: 'admin' },
        { model: User, as: 'developer' },
        { model: User, as: 'qa' },
        { model: User, as: 'document' },
        { model: Client, as: 'client' },
      ],
      where: {
        name: {
          [Op.iLike]: name, // case-insensitive match
        },
      },
    });

    if (!project) throw new Error('Project not found');
  
      // ✅ Ambil user berdasarkan role dari relasi Role
      const developers = await User.findAll({
        include: [
          {
            model: Role,
            as: 'Roles', // pastikan alias sesuai dengan yang didefinisikan di model
            where: { name: 'developer' },
            through: { attributes: [] },
          },
        ],
      });
  
      const testers = await User.findAll({
        include: [
          {
            model: Role,
            as: 'Roles', // pastikan alias sesuai dengan yang didefinisikan di model
            where: { name: 'qa' },
            through: { attributes: [] },
          },
        ],
      });
  
      const documents = await User.findAll({
        include: [
          {
            model: Role,
            as: 'Roles', // pastikan alias sesuai dengan yang didefinisikan di model
            where: { name: 'document' },
            through: { attributes: [] },
          },
        ],
      });

    res.render('dashboard/documentpage/project/detail', {
      layout: 'dashboard/documentpage/layouts/main',
      title: 'Detail Project',
      clients,
      project,
      developers,
      testers,
      documents,
    });
  } catch (err) {
    req.flash('error', 'Failed to load client details: ' + err.message);
    res.redirect('/dashboard-document');
  }
};  
  
exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);

    if (!project) {
      req.flash('error', 'Project tidak ditemukan.');
      return res.redirect('/dashboard-document/project-document');
    }

    const {
      status,
      progress
    } = req.body;

    await project.update({
      status,
      progress
    });

    req.flash('success', 'Project updated successfully');
    res.redirect('/dashboard-document/project-document');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengubah project.');
    req.flash('old', req.body);
    res.redirect('/dashboard-document/project-document');
  }
};
