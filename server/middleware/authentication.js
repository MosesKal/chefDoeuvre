const jwt = require("jsonwebtoken");
const db = require("../models/");

const authentication = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res
        .status(200)
        .json({ success: false, message: "Error! Token was not provided." });
    }
    const decodedToken = jwt.verify(token, "secretkeyappearshere");
    next();
  } catch (e) {
    res.send("Merci de vous authentifier");
  }
};

const verifySessionToken = async (req, res, next) => {
  const { tokens } = req.headers; 

 
  if (!tokens) {
    return res.status(401).json({ error: "Token de session manquant" });
  }

  try {
    const user = await db.User.findOne({ where: { Tokens: tokens } });


    if (!user) {
      return res.status(401).json({ error: "Session invalide" });
    }


    next();
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur" });
  }
};

const checkStatus = async (req, res, next) => {
  const { email } = req.body;

  try {
    const userExists = await db.User.findOne({ where: { email: email } });
    if (userExists) {
      const status = userExists.StatusCompt;

      if (status === process.env.STATUS_ATTENTE_VALIDATION) {
        return res
          .status(403)
          .json({
            message:
              "Votre compte est en cours de validation. Veuillez patienter.",
          });
      } else if (status === process.env.STATUS_REFUSE) {
        return res
          .status(403)
          .json({ message: "Votre inscription a été refusée." });
      }
    }

    next();
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({
        error:
          "Une erreur s'est produite lors de la vérification du statut du compte.",
      });
  }
};

module.exports = { authentication, verifySessionToken, checkStatus };
