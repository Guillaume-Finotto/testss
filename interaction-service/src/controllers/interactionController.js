const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Post = require("../../post-service/src/models/Post");
const User = require("../../user-service/src/models/User");

exports.likePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const existing = await Like.findOne({ where: { user_id: userId, post_id: postId } });
    if (existing) {
      return res.status(409).json({ message: "Vous avez déjà liké ce post" });
    }

    await Like.create({ user_id: userId, post_id: postId });

    const post = await Post.findByPk(postId);
    if (post && post.author_id !== userId) {
      await Notification.create({
        user_id: post.author_id,
        type: "like",
        source_id: postId,
        is_read: false,
      });
    }

    return res.status(201).json({ message: "Post liké" });
  } catch (err) {
    console.error("Erreur likePost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.unlikePost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;

  try {
    const like = await Like.findOne({ where: { user_id: userId, post_id: postId } });
    if (!like) {
      return res.status(404).json({ message: "Like non trouvé" });
    }
    await like.destroy();
    return res.status(200).json({ message: "Like retiré" });
  } catch (err) {
    console.error("Erreur unlikePost:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.addComment = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Contenu du commentaire manquant" });
  }

  try {
    const newComment = await Comment.create({
      post_id: postId,
      parent_comment_id: null,
      author_id: userId,
      content,
    });

    const mentionRegex = /@([a-zA-Z0-9_]+)/g;
    let match;
    while ((match = mentionRegex.exec(content)) !== null) {
      const mentionedUsername = match[1];
      const mentionedUser = await User.findOne({ where: { username: mentionedUsername } });
      if (mentionedUser && mentionedUser.id !== userId) {
        await Notification.create({
          user_id: mentionedUser.id,
          type: "mention",
          source_id: newComment.id,
          is_read: false,
        });
      }
    }

    const post = await Post.findByPk(postId);
    if (post && post.author_id !== userId) {
      await Notification.create({
        user_id: post.author_id,
        type: "comment",
        source_id: newComment.id,
        is_read: false,
      });
    }

    return res.status(201).json({ message: "Commentaire ajouté", comment: newComment });
  } catch (err) {
    console.error("Erreur addComment:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getComments = async (req, res) => {
  const postId = req.params.postId;
  try {
    const comments = await Comment.findAll({
      where: { post_id: postId },
      order: [["created_at", "ASC"]],
      include: [{ model: User, as: "Author", attributes: ["id", "username", "avatar_url"] }],
    });
    return res.status(200).json({ comments });
  } catch (err) {
    console.error("Erreur getComments:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.replyComment = async (req, res) => {
  const userId = req.user.id;
  const parentCommentId = req.params.commentId;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: "Contenu de la réponse manquant" });
  }

  try {
    const parent = await Comment.findByPk(parentCommentId);
    if (!parent) {
      return res.status(404).json({ message: "Commentaire parent non trouvé" });
    }

    const newComment = await Comment.create({
      post_id: parent.post_id,
      parent_comment_id: parentCommentId,
      author_id: userId,
      content,
    });

    if (parent.author_id !== userId) {
      await Notification.create({
        user_id: parent.author_id,
        type: "comment",
        source_id: newComment.id,
        is_read: false,
      });
    }

    return res.status(201).json({ message: "Réponse ajoutée", comment: newComment });
  } catch (err) {
    console.error("Erreur replyComment:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getNotifications = async (req, res) => {
  const userId = req.params.userId;
  if (req.user.id !== userId && req.user.role !== "admin" && req.user.role !== "mod") {
    return res.status(403).json({ message: "Non autorisé" });
  }

  try {
    const notifications = await Notification.findAll({
      where: { user_id: userId },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ notifications });
  } catch (err) {
    console.error("Erreur getNotifications:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.markNotificationRead = async (req, res) => {
  const notificationId = req.params.id;
  const userId = req.user.id;

  try {
    const notif = await Notification.findByPk(notificationId);
    if (!notif) return res.status(404).json({ message: "Notification non trouvée" });
    if (notif.user_id !== userId && req.user.role !== "admin") {
      return res.status(403).json({ message: "Non autorisé" });
    }

    notif.is_read = true;
    await notif.save();
    return res.status(200).json({ message: "Notification marquée comme lue" });
  } catch (err) {
    console.error("Erreur markNotificationRead:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
