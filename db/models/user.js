'use strict';

import bcrypt from 'bcrypt'

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Contact, {foreignKey: 'user_id'})
      User.belongsTo(models.Role, {foreignKey: 'role_id', onDelete: 'CASCADE'})
    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
    ,
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(user => {
    if (user.password)
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  })

  User.beforeUpdate(user => {
    if (user.changed('password'))
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  })
  return User;
};