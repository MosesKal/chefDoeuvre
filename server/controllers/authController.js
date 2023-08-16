const db = require("../models/");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const transporter = require("../mailConfig");

const PostLogin = async (req, res, next) => {
  let token;
  let roleUser;
  let prenom;
  let profile;
  let nom;
  let mail;
  let telephone;
  let id;

  let { email, password } = req.body;

  email = email.trim();

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Erreur, impossible de se connecter !",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Erreur, impossible de se connecter !",
      });
    }

    try {
      token = jwt.sign(
        { userId: user.id, email: user.email },
        "secretkeyappearshere",
        { expiresIn: "1h" }
      );

      user.Tokens = token;
      await user.save();
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erreur, impossible de se connecter !",
      });
    }
    roleUser = user.role;
    prenom = user.prenom;
    nom = user.nom;
    profile = user.Profile;
    mail = user.email;
    telephone = user.telephone;
    id = user.id;

  } catch (e) {
    console.log("Erreur lors de la connexion");
    return res
      .status(500)
      .json({ success: false, message: "Erreur lors de la connexion" });
  }

  res.status(200).json({
    success: true,
    data: {
      id,
      roles: roleUser,
      accessToken: token,
      nomUser: nom,
      prenomUser: prenom,
      profileUser: profile,
      telephone,
      mail,
    },
  });
};

const PostLogout = async (req, res) => {
  const { user } = req;
  try {
    user.Tokens = null;
    await user.save();
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur lors de la déconnexion" });
  }
};

const PostRegister = async (req, res, next) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Aucun fichier n'a été inclus dans la requête." });
  }

  const imageFile = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;

  const { email, password, prenom, nom, telephone } = req.body;

  if (!email) {
    return res.status(400).json({ error: "L'email est requis." });
  }

  try {
    const userExists = await db.User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({
        error: "Cet email est déjà utilisé par un autre utilisateur.",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.User.create({
      prenom: prenom,
      nom: nom,
      email: email,
      telephone: telephone,
      password: hashedPassword,
      StatusCompt: process.env.STATUS_ATTENTE_VALIDATION,
      Profile: imageFile,
    });

    if (!newUser) {
      return res
        .status(500)
        .json({ error: "Échec de la création de l'utilisateur." });
    }

    res
      .status(201)
      .json({ message: "Utilisateur créé avec succès.", user: newUser });

    transporter.sendMail(
      {
        from: email,
        to: email,
        subject: "Nouvelle inscription",
        text: "Un nouvel utilisateur s'est inscrit. Veuillez valider son compte.",
      },
      (error, info) => {
        if (error) {
          console.log("Erreur lors de l'envoi de l'e-mail :", error);
        } else {
          console.log("E-mail envoyé avec succès:", info.response);
        }
      }
    );

    const io = req.app.get("socketio");
    io.emit("newUserRegistration", { user: newUser });
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      const validationErrors = error.errors.map((err) => ({
        field: err.path,
        message: err.message,
      }));

      return res.status(400).json({ errors: validationErrors });
    }
    console.log(error);
    res.status(500).json({ error: "Échec de la création de l'utilisateur." });
  }
};

const PostForgotPassword = async (req, res, next) => {};

const PostResetPassword = async (req, res, next) => {};

module.exports = {
  PostLogin,
  PostLogout,
  PostRegister,
  PostForgotPassword,
  PostResetPassword,
};
