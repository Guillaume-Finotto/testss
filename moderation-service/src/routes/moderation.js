const express = require("express");
const router = express.Router();
const moderationController = require("../controllers/moderationController");
const verifyToken = require("../middleware/verifyToken");
const verifyRole = require("../middleware/verifyRole");

router.post("/reports", verifyToken, moderationController.createReport);
router.get("/reports", verifyToken, verifyRole, moderationController.getReports);
router.post("/users/:id/ban", verifyToken, verifyRole, moderationController.banUser);
router.post("/users/:id/unban", verifyToken, verifyRole, moderationController.unbanUser);

module.exports = router;
