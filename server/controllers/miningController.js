const db = require("../models/"); // Assurez-vous d'importer correctement vos modèles

const createCotation = async (req, res) => {
  const { startDate, endDate, description, duree, userid, produits } = req.body;

  try {
    const user = await db.User.findOne({
      where: {
        id: userid,
        role: "mining",
      },
    });

    if(!user){
      return res.status(403).json({error : "Non autorisé"});
    }

    if(!user.entrepriseId){
      return res.status(400).json({error : "L'utilisateur n'est pas associé à une entreprise"})
    }

    const cotation = await db.Cotations.create({
      date_debut: startDate,
      date_fin: endDate,
      description: description,
      duree_de_validation: duree,
      userId: userid,
    });

    const cotationId = cotation.id;

    const promises = produits.map(async (produit) => {
      await db.CotationProduit.create({
        quantite: produit.qty,
        CotationId: cotationId,
        ProduitId : produit.nameProduct.id,
        detail : produit.detail,
      });
      console.log(produit.detail);
    });

    await Promise.all(promises);
    res.status(204).json({ message: "la cotation à été créée" });
  } catch (error) {
    console.log("Erreur lors de la creation de la cotation :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de la cotation" });
    console.log(error)
  }
};

const getDataMining = async (req, res) => {
  try {
    const { token } = req.params;

    const userData = await db.User.findOne({
      include: [
        {
          model: db.Entreprise,
          attributes: [
            "id",
            "denomination",
            "logoEntreprise",
            "formeJuridique",
            "Description",
          ],
          include: [
            {
              model: db.Adresse,
              attributes: ["id", "province", "ville", "avenue"],
            },
          ],
        },
      ],
      where: {
        Tokens: token,
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({ userData });
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la récupération des données de mining :",
      error
    );
    res.status(500).json({ message: "Erreur serveur" });
  }
};

const getProduits = async (req, res)=>{
  try{
    const produits = await db.Produits.findAll();
    res.status(200).json(produits);
  }catch (e) {
    console.log(e);
    res.status(500).json({message : "Une erreur est survenue lors de la récupération des produits."})
  }
}

module.exports = { createCotation, getDataMining, getProduits};
