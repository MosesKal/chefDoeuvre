"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Entree extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Entree.belongsTo(models.Stock, {
        foreignKey: "stockId",
      });
    }
  }
  Entree.init(
    {
      qty: DataTypes.STRING,
      prix: DataTypes.STRING,
      stockId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Entree",
    }
  );
  return Entree;
};
