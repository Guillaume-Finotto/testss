const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middleware/verifyToken");

router.get("/:id", verifyToken, userController.getProfile);
router.put("/:id", verifyToken, userController.updateProfile);
router.post("/:id/follow", verifyToken, userController.followUser);
router.delete("/:id/unfollow", verifyToken, userController.unfollowUser);
router.get("/:id/followers", verifyToken, userController.getFollowers);
router.get("/:id/following", verifyToken, userController.getFollowing);

module.exports = router;
