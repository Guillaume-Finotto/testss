const User = require("../models/User");
const Follow = require("../models/Follow");
const { Op } = require("sequelize");

exports.getProfile = async (req, res) => {
  const targetId = req.params.id;
  try {
    const user = await User.findByPk(targetId, {
      attributes: ["id", "username", "email", "bio", "avatar_url", "language", "theme", "created_at"],
    });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const followersCount = await Follow.count({ where: { following_id: targetId } });
    const followingCount = await Follow.count({ where: { follower_id: targetId } });

    return res.status(200).json({ user, followersCount, followingCount });
  } catch (err) {
    console.error("Erreur getProfile:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.updateProfile = async (req, res) => {
  const targetId = req.params.id;
  const requesterId = req.user.id;
  const { bio, avatar_url, language, theme, username } = req.body;

  if (targetId !== requesterId) {
    return res.status(403).json({ message: "Non autorisé" });
  }

  try {
    const user = await User.findByPk(targetId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    user.bio = bio ?? user.bio;
    user.avatar_url = avatar_url ?? user.avatar_url;
    user.language = language ?? user.language;
    user.theme = theme ?? user.theme;
    user.username = username ?? user.username;

    await user.save();
    return res.status(200).json({ message: "Profil mis à jour", user });
  } catch (err) {
    console.error("Erreur updateProfile:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.followUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  if (followerId === followingId) {
    return res.status(400).json({ message: "Impossible de se suivre soi-même" });
  }

  try {
    const already = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    if (already) {
      return res.status(409).json({ message: "Déjà en train de suivre cet utilisateur" });
    }

    await Follow.create({ follower_id: followerId, following_id: followingId });
    return res.status(201).json({ message: "Utilisateur suivi avec succès" });
  } catch (err) {
    console.error("Erreur followUser:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.unfollowUser = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  try {
    const relation = await Follow.findOne({
      where: { follower_id: followerId, following_id: followingId },
    });
    if (!relation) {
      return res.status(404).json({ message: "Relation de suivi non trouvée" });
    }
    await relation.destroy();
    return res.status(200).json({ message: "Vous ne suivez plus cet utilisateur" });
  } catch (err) {
    console.error("Erreur unfollowUser:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getFollowers = async (req, res) => {
  const targetId = req.params.id;
  try {
    const followers = await Follow.findAll({
      where: { following_id: targetId },
      include: [{ model: User, as: "Follower", attributes: ["id", "username", "avatar_url"] }],
    });
    const result = followers.map((f) => f.Follower);
    return res.status(200).json({ followers: result });
  } catch (err) {
    console.error("Erreur getFollowers:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getFollowing = async (req, res) => {
  const targetId = req.params.id;
  try {
    const following = await Follow.findAll({
      where: { follower_id: targetId }, 
      include: [{ model: User, as: "Following", attributes: ["id", "username", "avatar_url"] }],
    });
    const result = following.map((f) => f.Following);
    return res.status(200).json({ following: result });
  } catch (err) {
    console.error("Erreur getFollowing:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
