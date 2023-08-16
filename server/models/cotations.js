"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Cotations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cotations.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Cotations.belongsToMany(models.Produits, { through: "CotationProduit" });

      Cotations.hasOne(models.Offres);
    }
  }
  Cotations.init(
    {
      date_debut: DataTypes.STRING,
      date_fin: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.STRING,
      duree_de_validation: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Cotations",
    }
  );
  return Cotations;
};
