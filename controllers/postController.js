const Post = require("../models/Post");

exports.viewCreatePost = (req, res) => {
  res.render("create-post");
};

exports.create = (req, res) => {
  let post = new Post(req.body, req.session.user._id);
  post
    .create()
    .then((result) => {
      if (result.success) {
        req.flash("success", "Post created successfully");
        req.session.save(() => {
          res.redirect(`/post/${result.post.insertedId}`);
        });
      } else {
        req.flash("errors", result.errors);
        req.session.save(() => {
          res.redirect("/create-post");
        });
      }
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect("/create-post");
      });
    });
};

exports.findPostbyId = (req, res) => {
  Post.findPostbyId(req.params.id, req.visitorId)
    .then((post) => {
      res.render("single-post", { post, title: post.title });
    })
    .catch(() => {
      res.render("404");
    });
};

exports.viewEditScreen = (req, res) => {
  Post.findPostbyId(req.params.id, req.visitorId)
    .then((post) => {
      if (post.isPostOwner) {
        res.render("edit-post", { post });
      } else {
        req.flash("errors", "You do not have the permission to perform such a action.");
        req.session.save(() => {
          res.redirect("/");
        });
      }
    })
    .catch(() => {
      res.render("404");
    });
};

exports.edit = (req, res) => {
  let post = new Post(req.body, req.visitorId, req.params.id);
  post
    .update()
    .then((status) => {
      if (status == "success") {
        req.flash("success", "Updated succesfully");
        req.session.save(() => {
          res.redirect(`/post/${req.params.id}/edit`);
        });
      } else {
        req.flash("errors", post.errors);
        req.session.save(() => {
          res.redirect(`/post/${req.params.id}/edit`);
        });
      }
    })
    .catch(() => {
      req.flash("errors", "You do not have the permission to perform such a action.");
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.delete = (req, res) => {
  Post.delete(req.params.id, req.visitorId)
    .then(() => {
      req.flash("success", "Post deleted successfully");
      req.session.save(() => {
        res.redirect(`/profile/${req.session.user.username}`);
      });
    })
    .catch((err) => {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect(`/profile/${req.session.user.username}`);
      });
    });
};

exports.search = (req, res) => {
  Post.search(req.body.searchTerm)
    .then((results) => {
      res.json(results);
    })
    .catch(() => {
      res.json({ error: "internal error" });
    });
};

exports.apiCreatePost = (req, res) => {
  let post = new Post(req.body, req.token._id);
  post
    .create()
    .then((result) => {
      if (result.success) {
        res.json({ _id: result.post.insertedId });
      } else {
        res.json({ errors: result.errors });
      }
    })
    .catch((err) => {
      res.json({ errors: result.errors });
    });
};

exports.apiDeletePost = (req, res) => {
  Post.delete(req.params.id, req.token._id)
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      res.json({ success: false, err });
    });
};

exports.apiFindPostsByAutor = (req, res) => {
  Post.findByAuthorId(req.user._id).then((posts) => {
    res.json(posts);
  });
};
