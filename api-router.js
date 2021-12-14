require("dotenv").config();
const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const cors = require("cors");

router.use(cors());

router.post("/login", userController.apiLogin);
router.post("/create-post", userController.apiAuth, postController.apiCreatePost);
router.delete("/post/:id", userController.apiAuth, postController.apiDeletePost);
router.get("/post/author/:username", userController.apiIfUserExists, postController.apiFindPostsByAutor);
module.exports = router;
