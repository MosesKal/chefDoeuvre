"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class CotationProduit extends Model {
    static associate(models) {}
  }
  CotationProduit.init(
    {
      quantite: DataTypes.INTEGER,
      detail : DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "CotationProduit",
    }
  );
  return CotationProduit;
};
