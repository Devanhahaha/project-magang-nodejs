const User = require('./User');
const Role = require('./Role');
const ModelHasRole = require('./ModelHasRole'); // ⬅️ Tambah ini

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

module.exports = { User, Role };
