const db = require("../models/");

const createProduct = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Aucun fichier n'a été inclus dans la requête." });
  }

  const photoProduit = `${req.protocol}://${req.get("host")}/imagesProduct/${
    req.file.filename
  }`;

  const { nom, categorieId } = req.body;

  const date = new Date();

  try {
    const produitExist = await db.Produits.findOne({
      where: { nom },
    });

    if (produitExist) {
      return res.status(400).json({
        error: "le produit existe.",
      });
    }

    const newProduit = await db.Produits.create({
      nom: nom,
      photo: photoProduit,
      date: date.toLocaleDateString(),
      categorieId,
    });

    if (!newProduit) {
      return res.status(500).json({ error: "Échec de la création du produit" });
    }

    res.status(201).json({
      message: "Produit créé avec succès.",
      produit: newProduit,
    });
    //....
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Échec de la création du produit." });
    }
  }
};

const createCategorie = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Aucun fichier n'a été inclus dans la requête." });
  }
  const imageCategorie = `${req.protocol}://${req.get("host")}/imagesProduct/${
    req.file.filename
  }`;

  const { nom } = req.body;

  try {
    const categorieExist = await db.categorie_produits.findOne({
      where: { nom_categorie: nom },
    });
    if (categorieExist) {
      return res.status(400).json({
        error: "la catégorie existe.",
      });
    }

    const newCategorie = await db.categorie_produits.create({
      nom_categorie: nom,
      illustration_categorie: imageCategorie,
    });

    if (!newCategorie) {
      return res
        .status(500)
        .json({ error: "Échec de la création de la catégorie" });
    }

    res.status(201).json({
      message: "Catégorie créée avec succès.",
      categorie: newCategorie,
    });
  } catch (error) {
    if (error) {
      console.log(error);
      res.status(500).json({ error: "Échec de la création de la catégorie." });
    }
  }
};

const getCotationDetails = async (req, res) => {
  try {
    const cotationId = req.params.cotationId;

    const cotation = await db.Cotations.findOne({
      where: { id: cotationId },
      include: [
        {
          model: db.User,
          include: [
            {
              model: db.Entreprise,
              attributes: [
                "denomination",
                "logoEntreprise",
                "formeJuridique",
                "Description",
              ],
            },
          ],
          attributes: ["email", "telephone"],
        },
        {
          model: db.Produits,
          include: {
            model: db.categorie_produits,
            attributes: ["nom_categorie", "illustration_categorie"],
          },
        },
      ],
    });

    if (!cotation) {
      return res.status(404).json({ error: "Cotation introuvable." });
    }

    const {
      date_debut,
      date_fin,
      duree_de_validation,
      description,
      User: { email, telephone, Entreprise },
      Produits,
    } = cotation;

    const cotationDetails = {
      email,
      telephone,
      entreprise: Entreprise.denomination,
      logoEntreprise: Entreprise.logoEntreprise,
      descriptionEntreprise: Entreprise.Description,
      formeJuridique: Entreprise.formeJuridique,
      date_debut,
      date_fin,
      duree_de_validation,
      description,
      produits: Produits.map((produit) => ({
        ...produit.toJSON(),
        nom_categorie: produit.categorie_produit.nom_categorie,
        illustration_categorie:
          produit.categorie_produit.illustration_categorie,
      })),
    };

    res.status(200).json(cotationDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Erreur lors de la récupération des informations de la cotation.",
    });
  }
};

const getAllCotations = async (req, res) => {
  try {
    const cotations = await db.Cotations.findAll({
      include: [
        {
          model: db.User,
          include: [
            {
              model: db.Entreprise,
              attributes: [
                "denomination",
                "logoEntreprise",
                "formeJuridique",
                "Description",
              ],
            },
          ],
          attributes: ["email", "telephone"],
        },
        {
          model: db.Produits,
          include: {
            model: db.categorie_produits,
            attributes: ["nom_categorie", "illustration_categorie"],
          },
        },
      ],
    });

    const cotationDetailsList = cotations.map((cotation) => {
      const {
        id,
        date_debut,
        date_fin,
        duree_de_validation,
        description,
        User: { email, telephone, Entreprise },
        Produits,
      } = cotation;

      const cotationDetails = {
        id,
        email,
        telephone,
        entreprise: Entreprise.denomination,
        logoEntreprise: Entreprise.logoEntreprise,
        descriptionEntreprise: Entreprise.Description,
        formeJuridique: Entreprise.formeJuridique,
        date_debut,
        date_fin,
        duree_de_validation,
        description,
        produits: Produits.map((produit) => ({
          ...produit.toJSON(),
          nom_categorie: produit.categorie_produit.nom_categorie,
          illustration_categorie:
            produit.categorie_produit.illustration_categorie,
        })),
      };

      return cotationDetails;
    });

    res.status(200).json(cotationDetailsList);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des cotations." });
  }
};

//Ajouter un stock pour un utilisateur donne

const addStock = async (req, res) => {
  try {
    const { userId, produitId, stock, stockDetail, prix, unite } = req.body;
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    const produit = await db.Produits.findByPk(produitId);
    if (!produit) {
      return res.status(404).json({ message: "Produit introuvable" });
    }
    const newStock = await db.Stock.create({
      userId: user.id,
      produitId: produit.id,
      stock: stock,
      stockDetail,
      prix,
      unite,
    });
    res.status(201).json(newStock);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la création du stock",
    });
  }
};

const getAllStocksByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const stocks = await db.Stock.findAll({
      where: { userId },
      include: [db.Produits], // Utilisez "include" avec une minuscule et spécifiez le modèle "Produits"
    });

    res.json(stocks);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des stocks.",
    });
  }
};

// Mettre a jour le stock d'un produit pour un utilisateur donne
const updateStock = async (req, res) => {
  try {
    const { stockId } = req.params;
    const { stock } = req.body;

    // Validation des données
    if (typeof stock !== "number" || stock < 0) {
      return res
        .status(400)
        .json({ message: "Le stock doit être un nombre entier positif" });
    }

    // Recherche du stock existant
    const existingStock = await db.Stock.findByPk(stockId);
    if (!existingStock) {
      return res
        .status(404)
        .json({ message: "Le stock avec cet ID n'existe pas" });
    }

    // Mise à jour du stock dans une transaction
    const updatedStock = await db.sequelize.transaction(async (transaction) => {
      existingStock.stock = stock;
      return existingStock.save({ transaction });
    });

    // Envoi de la réponse
    res.json(updatedStock);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la mise à jour du stock",
    });
  }
};
// Supprimer un stock pour un utilisateur donne
const deleteStock = async (req, res) => {
  try {
    const { stockId } = req.params;

    const existingStock = await db.Stock.findOne({ where: { id: stockId } });
    if (!existingStock) {
      return res.status(404).json({ message: "Le stock n'a pas été trouvé." });
    }

    // Effectuer des actions supplémentaires avant la suppression du stock
    // Par exemple, vous pouvez vérifier si le stock est utilisé ailleurs avant de le supprimer

    // Supprimer le stock
    await db.Stock.destroy({ where: { id: stockId } });

    res.json({ message: "Le stock a été supprimé avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la suppression du stock.",
    });
  }
};

const getStockAndProductByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Vérifier si l'utilisateur existe
    const user = await db.User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Récupérer le stock associé à l'utilisateur
    const stock = await db.Stock.findOne({ where: { userId } });
    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Récupérer les détails du produit associé au stock
    const product = await db.Product.findByPk(stock.productId);

    // Renvoyer la réponse avec les informations du stock et du produit
    res.status(200).json({ stock, product });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateStockByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { quantity } = req.body;

    const stock = await db.Stock.findOne({ where: { userId } });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    stock.stock = quantity;
    await stock.save();

    res.status(200).json({ message: "Stock updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Ajouter un produit pour un utilisateur

const addProductByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const { name, date, status } = req.body;
    const newProduct = await db.ProduitId.create({
      nom: name,
      date,
      statut: status,
      userId,
    });

    res.status(201).json({ product: newProduct });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getProduitsCategories = async (req, res) => {
  try {
    const produits = await db.Produits.findAll({
      include: {
        model: db.categorie_produits,
        attributes: ["nom_categorie", "illustration_categorie"],
      },
    });

    res.status(200).json(produits);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Une erreur est survenue lors de la récupération des produits.",
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await db.categorie_produits.findAll();

    res.status(200).json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des catégories.",
    });
  }
};

//
// Obtenir tous les produits d'un utilisateur
//
// const getAllProductsByUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//
//     const user = await db.User.findByPk(userId);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }
//
//     const products = await db.Produits.findAll({
//       where: { userId },
//       include: [{ model: db.User, as: 'user' }],
//     });
//
//     res.status(200).json({ products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

// const getProductsByUser = async (req, res)=>{
//   try {
//     const userId = req.params.userId;
//     const products = await Produits.findAll({ where: { userId } });
//
//     res.status(200).json({ products });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };


// //Mettre à jour un produit d'un utilisateur

const updateProductByUser = async (req, res) => {
  try{
    const userId = req.params.userId;
    const productId = req.params.productId;
    const {name, date, status} = req.body;
    const product = await db.Produits.findOne({where : {id:productId, userId}});

    if(!product){
      return res.status(404).json({message : "Product not found"});
    }
    product.nom = name;
    product.date = date;
    product.statut = status;
    await product.save();
    res.status(200).json({message : "Product updated successfully"});
  }catch(error){
    console.error(error);
    res.status(500).json({message : "Internal server error"});
  }
};

// // Supprimer un produit d'un utilisateur
// const deleteProductByUser = async (req, res) => {
//   try {
//     const userId = req.params.userId;
//     const productId = req.params.productId;
//
//     const product = await Produits.findOne({ where: { id: productId, userId } });
//
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }
//
//     await product.destroy();
//
//     res.status(200).json({ message: 'Product deleted successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };
//
// const addEntry = async(req, res) => {
//   try{
//     const {stockId, quantity, price} = req.body;
//     const stock = await db.Stock.findByPk(stockId);
//     if(!stock){
//       return res.status(404).json({message : "Stock not found"});
//     }
//     await Entree.create({
//       qty : quantity,
//       prix : price,
//       stockId : stock.id,
//     });
//     // Mettre à jour la quantité de stock
//     stock.stock += quantity;
//     await stock.save();
//     res.status(201).json({message : "Entry added successfully"});
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({message : "Internal server error"});
//   }
// };
//
// //Ajouter une sortie de produit
//
// const addExist = async (req, res) => {
//   try {
//     const {stockId, quantity} = req.body;
//     const stock = await db.Stock.findByPk(stockId);
//     if(!stock){
//       return res.status(404).json({message : "Stock not found"});
//     }
//     if(stock.stock < quantity) {
//       return res.status(400).json({message : "Stock insuffisant"});
//     }
//     await Sortie.create({
//       qty : quantity,
//       stockId: stock.id,
//     });
//
//     // Mettre à jour la quantité de stcok
//     stock.stock -= quantity;
//     await stock.save();
//     res.status(201).json({message : "Exit added successfully"});
//   }catch (error){
//     console.error(error);
//     res.status(500).json({message : "Internal server error"});
//   }
// };
//
// const createOrder = async (req, res) =>{
//   try{
//     const {clienId, date, status} = req.body;
//     const client = await db.Client.findByPk(clienId);
//     if(!client) {
//       return res.status(404).json({message : "Client not found"});
//     }
//     const newOrder = await Commande.create({
//       date,
//       status,
//       ClientId : cliend.id,
//     });
//     res.status(201).json({order : newOrder});
//   }catch(error){
//     console.error(error);
//     res.status(500).json({message : "internal server error"});
//   }
// };
//
// //Obtenir toutes les commandes d'un client
//
// const getOrdersByClient = async (req, res)=>{
//   try{
//     const clientId = req.params.clientId;
//     const orders = await db.Commande.findAll({where : {ClientId : cliendId}});
//
//     res.status(200).json({orders});
//   }catch (error){
//     console.error(error);
//     res.status(500).json({message : "Internal serveur error"});
//   }
// };
//
// //Mettre a jour une commande
//
// const updateOrder = async (req, res)=>{
//   try{
//     const orderId = req.params.orderId;
//     const {date ,status} = req.body;
//     const order= await db.Commande.findByPk(orderId);
//
//     if(!order) {
//       return res.status(404).json({message : "Order not found"});
//     }
//     order.date = date;
//     order.status = status;
//     await order.save();
//
//     res.status(200).json({message : "Order updated successfully"});
//   }catch(error){
//     console.error(error);
//     res.status(500).json({message : "Internal server error"});
//   }
// };
//
// //Supprimer une commande
//
// const deleteOrder = async (req, res) =>{
//   try{
//     const orderId = req.params.orderId;
//     const order = await db.Commande.findByPk(orderId);
//     if(!order){
//       return res.status(404).json({message : "Order not found"});
//     }
//     await order.destroy();
//     res.status(200).json({message : "order deleted successfully"});
//   }catch (error) {
//     console.error(error);
//     res.status(500).json({message : "Internal server error"});
//   }
// };

module.exports = {
  createProduct,
  createCategorie,
  getCotationDetails,
  getAllCotations,
  addStock,
  getAllStocksByUser,
  updateStock,
  deleteStock,
  getStockAndProductByUser,
  updateStockByUser,
  getProduitsCategories,
  getAllCategories,
};
