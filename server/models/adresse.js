"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Adresse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Adresse.belongsTo(models.Entreprise, {
        foreignKey: "entrepriseId",
      });
    }
  }
  Adresse.init(
    {
      province: DataTypes.STRING,
      ville: DataTypes.STRING,
      avenue: DataTypes.STRING,
      entrepriseId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Adresse",
    }
  );
  return Adresse;
};
