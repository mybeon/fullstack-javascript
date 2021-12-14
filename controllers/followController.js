const Follow = require("../models/Follow");

exports.followUser = (req, res) => {
  let follow = new Follow(req.visitorId, req.params.username);
  follow
    .create()
    .then(() => {
      req.flash("success", `You are now following ${req.params.username}`);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    });
};

exports.unfollowUser = (req, res) => {
  let unfollow = new Follow(req.visitorId, req.params.username);
  unfollow
    .delete()
    .then(() => {
      req.flash("success", `You have stopped following ${req.params.username}`);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect(`/profile/${req.params.username}`);
      });
    });
};
