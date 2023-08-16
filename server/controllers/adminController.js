const db = require("../models/");

const PostRegisterMining = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Aucun fichier n'a été inclus dans la requête." });
  }
  const logoEntreprise = `${req.protocol}://${req.get("host")}/images/${
    req.file.filename
  }`;

  const { denomination, formeJuridique, Description } = req.body;

  try {
    const entrepriseExist = await db.Entreprise.findOne({
      where: { denomination },
    });
    if (entrepriseExist) {
      return res.status(400).json({
        error: "Cette entreprise existe.",
      });
    }

    const newEntreprise = await db.Entreprise.create({
      denomination: denomination,
      Description: Description,
      formeJuridique: formeJuridique,
      logoEntreprise: logoEntreprise,
    });

    if (!newEntreprise) {
      return res
        .status(500)
        .json({ error: "Échec de la création de l'entreprise." });
    }

    res.status(201).json({
      message: "Entreprise créée avec succès.",
      entreprise: newEntreprise,
    });
    //....
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Échec de la création de l'entreprise" });
    }
  }
};

const createAddress = async (req, res) => {
  const { province, ville, avenue, entrepriseId } = req.body;
  try {
    const addressExist = await db.Adresse.findOne({ where: { entrepriseId } });
    if (addressExist) {
      return res.status(400).json({
        error: "Cette adresse existe",
      });
    }

    const newAddress = await db.Adresse.create({
      province: province,
      ville: ville,
      avenue: avenue,
      entrepriseId: entrepriseId,
    });

    if (!newAddress) {
      return res
        .status(500)
        .json({ error: "Echec de la creation de l'adresse." });
    }
    res.status(201).json({
      message: "Adresse créée avec succès.",
      adresse: newAddress,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Echec de la création de l'adresse" });
    }
  }
};

module.exports = { PostRegisterMining, createAddress };
