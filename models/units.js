'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Unit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Unit.init({
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    deskripsi: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    no_telepon_pic: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_pic: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  }, {
    sequelize,
    modelName: 'Unit',
    tableName: 'units',
  });
  return Unit;
};