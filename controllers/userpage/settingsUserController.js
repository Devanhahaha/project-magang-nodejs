const User = require('../../models/User');
const Component = require('../../models/Component');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

exports.index = async (req, res) => {
  const user = req.session.user;
  const components = await Component.findOne();

  if (!user) return res.redirect('/login');

  res.render('userpage/settings/index', {
    layout: 'userpage/layouts/main',
    title: 'Settings',
    user,
    components,
  });
};

exports.update = async (req, res) => {
  const { name, email, contact, current_password, new_password, confirm_password } = req.body;
  const { id } = req.params;
  
  const errors = [];

  if (!name || !email || !contact) {
    errors.push('Name, Email, and Contact are required.');
  }

  if (new_password || confirm_password || current_password) {
    if (!current_password) errors.push('Current password is required for changing password.');
    if (new_password !== confirm_password) errors.push('New password and confirmation must match.');
    if (new_password.length < 8) errors.push('New password must be at least 8 characters.');
  }

  if (errors.length > 0) {
    req.flash('errors', errors);
    req.flash('old', req.body);
    return res.redirect('/settings-user');
  }

  try {
    const user = await User.findByPk(id);
    const component = await Component.findOne();

    // Cek email unik
    const emailExist = await User.findOne({ where: { email } });
    if (emailExist && emailExist.id !== user.id) {
      req.flash('error', 'Email already taken by another user.');
      return res.redirect('/settings-user');
    }

    user.name = name;
    user.email = email;
    user.contact = contact;

    if (current_password && new_password) {
      const passwordMatch = await bcrypt.compare(current_password, user.password);
      if (!passwordMatch) {
        req.flash('error', 'Current password is incorrect.');
        return res.redirect('/settings-user');
      }

      user.password = await bcrypt.hash(new_password, 10);
    }

    await user.save();

    // Perbarui session
    req.session.user = {
      ...req.session.user,
      name: user.name,
      email: user.email,
      contact: user.contact
    };

    req.flash('success', 'Data updated successfully!');
    return res.redirect('/settings-user');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Failed to update user: ' + error.message);
    return res.redirect('/settings-user');
  }
};
