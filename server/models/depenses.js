"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class depenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      depenses.belongsTo(models.User, {
        foreignKey: "userId",
      });
    }
  }
  depenses.init(
    {
      montant: DataTypes.STRING,
      illustration_categorie: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "depenses",
    }
  );
  return depenses;
};
