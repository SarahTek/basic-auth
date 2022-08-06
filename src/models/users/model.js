const SECRET = process.env.SECRET;
const HASH_STRENGTH = 10;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userModel = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.STRING },
    token: {
      type: DataTypes.VIRTUAL,
      get() {
        const payload = { username: this.username, role: this.role };
        return jwt.sign(payload, SECRET, { expiresIn: process.env.JWTEXPIRE }  );
      },
    },
  });

  model.beforeCreate(async (user) => {
    let hashedPassword = await bcrypt.hash(user.password, HASH_STRENGTH);
    user.password = hashedPassword;
    user.role = 'admin';
  });

  return model;
};

module.exports = userModel;
