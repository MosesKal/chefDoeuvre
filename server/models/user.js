"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Cotations);
      User.hasMany(models.Client);
      User.hasMany(models.Stock);
      User.hasMany(models.depenses);
      User.belongsTo(models.Entreprise, {
        foreignKey: "entrepriseId",
      });
    }
  }
  User.init(
    {
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le prénom est requis.",
          },
        },
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le nom est requis.",
          },
        },
      },
      role: {
        type: DataTypes.ENUM("admin", "seller", "mining"),
        defaultValue: "admin",
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "L'email est requis.",
          },
          isEmail: {
            msg: "L'email doit être une adresse email valide.",
          },
          async isUniqueEmail(value) {
            const user = await this.constructor.findOne({
              where: { email: value },
            });
            if (user) {
              throw new Error(
                "Cet email est déjà utilisé par un autre utilisateur."
              );
            }
          },
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: "Le numéro de téléphone est requis.",
          },
          isValidPhoneNumber(value) {
            const phoneNumberRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
            if (!phoneNumberRegex.test(value)) {
              throw new Error(
                "Le numéro de téléphone doit être un numéro valide au format international."
              );
            }
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Le mot de passe est requis.",
          },
        },
      },
      Tokens: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      StatusCompt: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      Profile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
