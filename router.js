const express = require("express");
const router = express.Router();
const userController = require("./controllers/userController");
const postController = require("./controllers/postController");
const followController = require("./controllers/followController");
const upload = require("./multer");

// User related routes

router.get("/", userController.home);
router.post("/register", userController.register);
router.post("/login", userController.login);
router.post("/logout", userController.logout);
router.post("/doesUsernameExists", userController.doesUsernameExists);
router.post("/doesEmailExists", userController.doesEmailExists);
router.get("/verify/:token", userController.verifyEmail);
router.get("/verify/:id/resend", userController.resendEmail);

// Profile related routes

router.get("/profile/:username", userController.ifUserExists, userController.sharedProfileData, userController.profilePostScreen);
router.get("/profile/:username/followers", userController.ifUserExists, userController.sharedProfileData, userController.profileFollowersScreen);
router.get("/profile/:username/following", userController.ifUserExists, userController.sharedProfileData, userController.profileFollowingScreen);
router.get("/profile/:username/edit", userController.mustBeLoggedIn, userController.ifUserExists, userController.ifVerifiedEmail, userController.editProfileScreen);
router.post("/upload/profileImg", userController.ifVerifiedEmail, upload.single("img"), userController.uploadImage);

// Post related routes
router.get("/create-post", userController.mustBeLoggedIn, postController.viewCreatePost);
router.post("/create-post", userController.ifVerifiedEmail, userController.mustBeLoggedIn, postController.create);
router.get("/post/:id", postController.findPostbyId);
router.get("/post/:id/edit", userController.mustBeLoggedIn, postController.viewEditScreen);
router.post("/post/:id/edit", userController.mustBeLoggedIn, postController.edit);
router.post("/post/:id/delete", userController.mustBeLoggedIn, postController.delete);
router.post("/search", userController.mustBeLoggedIn, postController.search);

// Follow related routes
router.post("/follow/:username", userController.mustBeLoggedIn, userController.ifVerifiedEmail, userController.ifUserExists, followController.followUser);
router.post("/follow/delete/:username", userController.mustBeLoggedIn, userController.ifVerifiedEmail, userController.ifUserExists, followController.unfollowUser);

module.exports = router;
