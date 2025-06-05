const express = require("express");
const router = express.Router();
const interactionController = require("../controllers/interactionController");
const verifyToken = require("../middleware/verifyToken");

router.post("/posts/:postId/like", verifyToken, interactionController.likePost);
router.delete("/posts/:postId/unlike", verifyToken, interactionController.unlikePost);
router.post("/posts/:postId/comments", verifyToken, interactionController.addComment);
router.get("/posts/:postId/comments", verifyToken, interactionController.getComments);
router.post("/comments/:commentId/reply", verifyToken, interactionController.replyComment);
router.get("/users/:userId/notifications", verifyToken, interactionController.getNotifications);
router.post("/notifications/:id/read", verifyToken, interactionController.markNotificationRead);

module.exports = router;
