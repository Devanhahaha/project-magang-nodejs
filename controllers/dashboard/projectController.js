const Project = require('../../models/dashboard/Project');
const User = require('../../models/dashboard/User');
const Role = require('../../models/dashboard/Role');
const Client = require('../../models/dashboard/Client');
const fs = require('fs');
const path = require('path');
const { Op } = require('sequelize');

function stripHTML(input) {
    return input.replace(/<[^>]*>?/gm, '');
}

exports.index = async (req, res) => {
    try {
      const projects = await Project.findAll({
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
          ...item.toJSON(), // Convert Sequelize instance ke plain object
          descPreview: stripHTML(item.desc),
          ...item.dataValues,
          start_date: formatTanggal(item.start_date),
          end_date: formatTanggal(item.end_date),
          ba_serah_terima: formatTanggal(item.ba_serah_terima),
        };
      });
      
      const clients = await Client.findAll();
  
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
  
      res.render('dashboard/adminpage/project/index', {
        title: 'Projects',
        projects: projectWithPreview,
        layout: 'dashboard/layouts/main',
        clients,
        developers,
        testers,
        documents,
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

    res.render('dashboard/adminpage/project/detail', {
      layout: 'dashboard/layouts/main',
      title: 'Detail Project',
      clients,
      project,
      developers,
      testers,
      documents,
    });
  } catch (err) {
    req.flash('error', 'Failed to load client details: ' + err.message);
    res.redirect('/dashboard');
  }
};  
  
exports.store = async (req, res) => {
  try {
    const {
      name,
      title,
      desc,
      status,
      category,
      type,
      client_id,
      developer_id,
      qa_id,
      document_id,
      bidang,
      lokasi,
      nama_pemberi_jasa,
      alamat_pemberi_jasa,
      nomor_kontrak,
      nilai_kontrak,
      start_date,
      end_date,
      ba_serah_terima
    } = req.body;

    const logo = req.file ? req.file.filename : null;

    await Project.create({
      logo_project: logo,
      name,
      title,
      desc,
      status,
      category,
      type,
      user_id: req.session.user.id, // sesuaikan session user kamu
      client_id,
      developer_id,
      qa_id,
      document_id,
      bidang,
      lokasi,
      nama_pemberi_jasa,
      alamat_pemberi_jasa,
      nomor_kontrak,
      nilai_kontrak,
      start_date,
      end_date,
      ba_serah_terima
    });

    req.flash('success', 'Project created successfully.');
    res.redirect('/dashboard/project');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menambahkan project.');
    req.flash('old', req.body);
    res.redirect('/dashboard/project');
  }
};

exports.update = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);

    if (!project) {
      req.flash('error', 'Project tidak ditemukan.');
      return res.redirect('/dashboard/project');
    }

    const {
      name,
      title,
      desc,
      status,
      category,
      type,
      client_id,
      developer_id,
      qa_id,
      document_id,
      bidang,
      lokasi,
      nama_pemberi_jasa,
      alamat_pemberi_jasa,
      nomor_kontrak,
      nilai_kontrak,
      start_date,
      end_date,
      ba_serah_terima
    } = req.body;

    // Hapus file lama jika ada file baru
    if (req.file && project.logo_project) {
      const oldPath = path.join('public/dashboard/storage/files/project', project.logo_project);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await project.update({
      logo_project: req.file ? req.file.filename : project.logo_project,
      name,
      title,
      desc,
      status,
      category,
      type,
      client_id,
      developer_id,
      qa_id,
      document_id,
      bidang,
      lokasi,
      nama_pemberi_jasa,
      alamat_pemberi_jasa,
      nomor_kontrak,
      nilai_kontrak,
      start_date,
      end_date,
      ba_serah_terima
    });

    req.flash('success', 'Project updated successfully');
    res.redirect('/dashboard/project');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal mengubah project.');
    req.flash('old', req.body);
    res.redirect('/dashboard/project');
  }
};

exports.destroy = async (req, res) => {
  try {
    const id = req.params.id;
    const project = await Project.findByPk(id);

    if (!project) {
      req.flash('error', 'Project tidak ditemukan.');
      return res.redirect('/dashboard/project');
    }

    // Hapus file gambar jika ada
    if (project.logo_project) {
      const filePath = path.join('public/dashboard/storage/files/project', project.logo_project);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await project.destroy();

    req.flash('success', 'Project deleted successfully.');
    res.redirect('/dashboard/project');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Gagal menghapus project.');
    res.redirect('/dashboard/project');
  }
};
