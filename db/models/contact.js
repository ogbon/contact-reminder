'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Contact.belongsTo(models.User, {foreignKey: 'user_id', onDelete: 'CASCADE'})
    }
  };
  Contact.init({
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meetingPlace: {
      type: DataTypes.STRING,
      allowNull: false
    },
    meetingDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    purpose: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Contact',
  });
  return Contact;
};