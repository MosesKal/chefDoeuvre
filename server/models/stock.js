"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Stock.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Stock.belongsTo(models.Produits, {
        foreignKey: "produitId",
      });

      Stock.hasMany(models.Entree);
      Stock.hasMany(models.Sortie);
    }
  }
  Stock.init(
    {
      stock: DataTypes.INTEGER,
      prix: DataTypes.FLOAT,
      userId: DataTypes.INTEGER,
      produitId: DataTypes.INTEGER,
      stockDetail: DataTypes.STRING,
      unite: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Stock",
    }
  );
  return Stock;
};
