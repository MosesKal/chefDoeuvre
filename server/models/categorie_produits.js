"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class categorie_produits extends Model {
    static associate(models) {
      categorie_produits.hasMany(models.Produits);
    }
  }

  categorie_produits.init(
    {
      nom_categorie: DataTypes.STRING,
      illustration_categorie: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "categorie_produits",
    }
  );

  return categorie_produits;
};
