"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sortie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sortie.belongsTo(models.Stock, {
        foreignKey: "stockId",
      });

      Sortie.belongsTo(models.Commande, {
        foreignKey: "CommandeId",
      });
    }
  }
  Sortie.init(
    {
      qty: DataTypes.STRING,
      stockId: DataTypes.INTEGER,
      CommandeId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Sortie",
    }
  );
  return Sortie;
};
