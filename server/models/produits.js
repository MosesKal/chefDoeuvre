"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Produits extends Model {
    static associate(models) {
      Produits.belongsTo(models.categorie_produits, {
        foreignKey: "categorieId",
      });

      Produits.belongsToMany(models.Offres, { through: "OffreProduit" });
      Produits.belongsToMany(models.Cotations, { through: "CotationProduit" });
      Produits.hasMany(models.Stock);
    }
  }

  Produits.init(
    {
      nom: DataTypes.STRING,
      date: DataTypes.STRING,
      statut: DataTypes.STRING,
      photo: DataTypes.TEXT,
      categorieId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Produits",
    }
  );

  return Produits;
};
