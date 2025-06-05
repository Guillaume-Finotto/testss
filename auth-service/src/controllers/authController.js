const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

exports.signup = async (req, res) => {
  const { email, username, password } = req.body;
  if (!(email && username && password)) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const existingUser = await User.findOne({
      where: { [User.sequelize.Op.or]: [{ email }, { username }] },
    });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Email ou nom d’utilisateur déjà utilisé" });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      email,
      username,
      password_hash: hashedPassword,
      role: "user",
    });

    return res
      .status(201)
      .json({ message: "Utilisateur créé avec succès", userId: newUser.id });
  } catch (err) {
    console.error("Erreur signup:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    return res.status(400).json({ message: "Champs manquants" });
  }

  try {
    const user = await User.findOne({
      where: { email },
    });
    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" });
    }

    const payload = { userId: user.id, role: user.role };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_REFRESH_EXPIRATION,
    });

    return res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Erreur signin:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token manquant" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const payload = { userId: decoded.userId, role: decoded.role };
    const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });
    return res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    console.error("Erreur refreshToken:", err);
    return res.status(401).json({ message: "Refresh token invalide ou expiré" });
  }
};
