const User = require('./User');
const Role = require('./Role');
const ModelHasRole = require('./ModelHasRole'); // ⬅️ Tambah ini
const Client = require('./Client');
const Project = require('./Project');

User.belongsToMany(Role, {
  through: ModelHasRole, // ⬅️ pakai model, bukan string
  foreignKey: 'model_id',
  as: 'Roles',
  otherKey: 'role_id',
  constraints: false
});

Role.belongsToMany(User, {
  through: ModelHasRole, // ⬅️ juga di sini
  foreignKey: 'role_id',
  as: 'Users',
  otherKey: 'model_id',
  constraints: false
});

Project.belongsTo(Client, {
  foreignKey: 'client_id', // sesuaikan nama kolom foreign key
  as: 'client' // alias untuk relasi ini
});

// (Opsional) Jika Client punya banyak project
Client.hasMany(Project, {
  foreignKey: 'client_id',
  as: 'projects' // alias untuk relasi ini
});


module.exports = { User, Role, Client, Project };
