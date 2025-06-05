const Report = require("../models/Report");
const User = require("../../user-service/src/models/User");

exports.createReport = async (req, res) => {
  const reporterId = req.user.id;
  const { target_type, target_id, reason } = req.body;

  if (!["post", "comment", "user"].includes(target_type)) {
    return res.status(400).json({ message: "Type de cible invalide" });
  }

  try {
    const newReport = await Report.create({
      reporter_id: reporterId,
      target_type,
      target_id,
      reason,
      status: "pending",
    });
    return res.status(201).json({ message: "Signalement créé", report: newReport });
  } catch (err) {
    console.error("Erreur createReport:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.getReports = async (req, res) => {
  const statusFilter = req.query.status || "pending";
  if (!["pending", "resolved", "rejected"].includes(statusFilter)) {
    return res.status(400).json({ message: "Filtre de statut invalide" });
  }
  try {
    const reports = await Report.findAll({
      where: { status: statusFilter },
      order: [["created_at", "DESC"]],
    });
    return res.status(200).json({ reports });
  } catch (err) {
    console.error("Erreur getReports:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.banUser = async (req, res) => {
  const targetId = req.params.id;
  try {
    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.role = "banned";
    await user.save();

    return res.status(200).json({ message: "Utilisateur banni avec succès" });
  } catch (err) {
    console.error("Erreur banUser:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.unbanUser = async (req, res) => {
  const targetId = req.params.id;
  try {
    const user = await User.findByPk(targetId);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    user.role = "user";
    await user.save();

    return res.status(200).json({ message: "Utilisateur débanni avec succès" });
  } catch (err) {
    console.error("Erreur unbanUser:", err);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
