const Post = require("../models/Post");
const { Op } = require("sequelize");
const Follow = require("../../user-service/src/models/Follow");

exports.createPost = async (req, res) => {
  const { content, tags, media_url } = req.body;
  const author_id = req.user.id;

  if (!content || content.length > 280) {
    return res.status(400).json({ message: "Contenu invalide" });
  }

  try {
    const newPost = await Post.create({
      author_id,
      content,
      tags,
      media_url,
    });
    return res.status(201).json({ message: "Post créé", post: newPost });
  } catch (err) {
    console.error("Erreur createPost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getPost = async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await Post.findByPk(postId);
    if (!post) {
      return res.status(404).json({ message: "Post non trouvé" });
    }
    return res.status(200).json({ post });
  } catch (err) {
    console.error("Erreur getPost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.updatePost = async (req, res) => {
  const postId = req.params.id;
  const { content, tags, media_url } = req.body;
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    if (post.author_id !== requesterId && requesterRole !== "admin" && requesterRole !== "mod") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    if (content && content.length > 280) {
      return res.status(400).json({ message: "Contenu trop long" });
    }

    post.content = content ?? post.content;
    post.tags = tags ?? post.tags;
    post.media_url = media_url ?? post.media_url;
    post.updated_at = new Date();

    await post.save();
    return res.status(200).json({ message: "Post mis à jour", post });
  } catch (err) {
    console.error("Erreur updatePost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.deletePost = async (req, res) => {
  const postId = req.params.id;
  const requesterId = req.user.id;
  const requesterRole = req.user.role;

  try {
    const post = await Post.findByPk(postId);
    if (!post) return res.status(404).json({ message: "Post non trouvé" });

    if (post.author_id !== requesterId && requesterRole !== "admin" && requesterRole !== "mod") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await post.destroy();
    return res.status(200).json({ message: "Post supprimé" });
  } catch (err) {
    console.error("Erreur deletePost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getPostsByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const posts = await Post.findAll({
      where: { author_id: userId },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ posts });
  } catch (err) {
    console.error("Erreur getPostsByUser:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getFeed = async (req, res) => {
  const userId = req.user.id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const offset = (page - 1) * limit;

  try {
    const follows = await Follow.findAll({
      where: { follower_id: userId },
    });
    const followingIds = follows.map((f) => f.following_id);

    followingIds.push(userId);

    const posts = await Post.findAll({
      where: { author_id: { [Op.in]: followingIds } },
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    return res.status(200).json({ page, limit, posts });
  } catch (err) {
    console.error("Erreur getFeed:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
