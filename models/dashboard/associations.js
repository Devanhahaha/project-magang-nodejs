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

// Relasi User (multi peran) di Project
Project.belongsTo(User, { foreignKey: 'user_id', as: 'admin' });
Project.belongsTo(User, { foreignKey: 'developer_id', as: 'developer' });
Project.belongsTo(User, { foreignKey: 'qa_id', as: 'qa' });
Project.belongsTo(User, { foreignKey: 'document_id', as: 'document' });

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
