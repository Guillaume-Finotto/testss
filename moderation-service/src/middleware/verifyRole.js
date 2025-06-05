function verifyRole(req, res, next) {
  const userRole = req.user.role;
  if (userRole !== "mod" && userRole !== "admin") {
    return res.status(403).json({ message: "Rôle non autorisé" });
  }
  next();
}

module.exports = verifyRole;
