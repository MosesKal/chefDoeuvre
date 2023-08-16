"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entreprise extends Model {
    static associate(models) {
      // define association here
      Entreprise.hasOne(models.User, {
        foreignKey: "entrepriseId",
        // as: "entreprise", // Utiliser le même alias que dans le modèle User
      });
      Entreprise.hasOne(models.Adresse);
    }
  }
  Entreprise.init(
    {
      logoEntreprise: DataTypes.STRING,
      denomination: DataTypes.STRING,
      formeJuridique: DataTypes.STRING,
      Description: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Entreprise",
    }
  );
  return Entreprise;
};
