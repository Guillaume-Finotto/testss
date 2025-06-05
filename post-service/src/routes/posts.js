const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const verifyToken = require("../middleware/verifyToken");

router.post("/", verifyToken, postController.createPost);
router.get("/:id", verifyToken, postController.getPost);
router.put("/:id", verifyToken, postController.updatePost);
router.delete("/:id", verifyToken, postController.deletePost);
router.get("/users/:id/posts", verifyToken, postController.getPostsByUser);
router.get("/feed", verifyToken, postController.getFeed);

module.exports = router;
