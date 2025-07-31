const Client = require('../../models/dashboard/Client');
const Project = require('../../models/dashboard/Project');
const fs = require('fs');
const path = require('path');

exports.store = async (req, res) => {
  try {
    const { project_id, name } = req.body;
    const logo = req.file ? req.file.filename : null;

    await Client.create({ 
    project_id: null, 
    name, 
    logo 
    });

    req.flash('success', 'Client created successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Gagal menambahkan client: ' + err.message);
    res.redirect('/dashboard');
  }
};

exports.showByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    const clients = await Client.findOne({ 
      where: { name },
      include: [{
        model: Project,
        as: 'projects',
      }],
     });

    if (!clients) throw new Error('Client not found');

    const projects = await Project.findAll({
      include: [{
        model: Client,
        as: 'client',
      }],
    });

    res.render('dashboard/adminpage/dashboard/detail-client', {
      layout: 'dashboard/layouts/main',
      title: 'Detail Client',
      clients,
      projects,
    });
  } catch (err) {
    req.flash('error', 'Failed to load client details: ' + err.message);
    res.redirect('/dashboard');
  }
};  

exports.update = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) throw new Error('Client tidak ditemukan');

    const { project_id, name } = req.body;
    let logo = client.logo;

    if (req.file) {
      // Hapus file lama
      if (logo) {
        const oldPath = path.join(__dirname, '../../../public/dashboard/storage/files/clients/', logo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      logo = req.file.filename;
    }

    await client.update({ project_id, name, logo });

    req.flash('success', 'Client updated successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Gagal mengupdate client: ' + err.message);
    res.redirect('/dashboard');
  }
};

exports.destroy = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) throw new Error('Client tidak ditemukan');

    if (client.logo) {
      const filePath = path.join(__dirname, '../../../public/dashboard/storage/files/clients/', client.logo);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await client.destroy();

    req.flash('success', 'Client deleted successfully.');
    res.redirect('/dashboard');
  } catch (err) {
    req.flash('error', 'Gagal menghapus client: ' + err.message);
    res.redirect('/dashboard');
  }
};
