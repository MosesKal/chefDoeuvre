"use strict";

const Commande_clients = require("./commande_clients");

const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Client.belongsTo(models.User, {
        foreignKey: "userId",
      });

      Client.belongsToMany(models.Commande, { through: "Commande_clients" });
    }
  }
  Client.init(
    {
      nom_client: DataTypes.STRING,
      phone_client: DataTypes.STRING,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Client",
    }
  );
  return Client;
};
