"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Offres extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

    static associate(models) {
      // define association here
      Offres.belongsToMany(models.Produits, { through: "OffreProduit" });
      Offres.belongsTo(models.Cotations, {
        foreignKey: "cotationId",
      });

      Offres.hasOne(models.Commande);
    }
  }
  Offres.init(
    {
      total: DataTypes.FLOAT,
      cotationId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Offres",
    }
  );
  return Offres;
};
