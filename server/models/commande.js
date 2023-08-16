"use strict";

const Commande_clients = require("./commande_clients");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Commande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Commande.belongsToMany(models.Client, { through: "Commande_clients" });
      Commande.hasOne(models.Sortie);
      Commande.belongsTo(models.Offres, {
        foreignKey: "OffresId",
      });
    }
  }
  Commande.init(
    {
      date: DataTypes.STRING,
      stus: DataTypes.STRING,
      OffresId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Commande",
    }
  );
  return Commande;
};
