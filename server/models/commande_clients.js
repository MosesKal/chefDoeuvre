"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Commande_clients extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Commande_clients.init(
    {
      qty_commande: DataTypes.STRING,
      price_commande: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "Commande_clients",
    }
  );
  return Commande_clients;
};
