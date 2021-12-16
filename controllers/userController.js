require("dotenv").config();
const User = require("../models/User");
const Post = require("../models/Post");
const Follow = require("../models/Follow");
const jsonWebToken = require("jsonwebtoken");

exports.home = (req, res) => {
  if (req.session.user) {
    Post.postFeed(req.session.user._id)
      .then((posts) => {
        res.render("home-dashboard", { posts });
      })
      .catch(() => {
        res.redirect(`/profile/${req.session.user.username}`);
      });
  } else {
    res.render("home-guest", {
      regErrors: req.flash("regErrors"),
    });
  }
};

exports.ifUserExists = (req, res, next) => {
  User.findByUsername(req.params.username)
    .then((userDoc) => {
      req.userProfile = userDoc;
      next();
    })
    .catch(() => {
      res.render("404");
    });
};

exports.profilePostScreen = (req, res) => {
  Post.findByAuthorId(req.userProfile._id)
    .then((posts) => {
      res.render("profile", {
        isVisitorsProfile: req.isVisitorsProfile,
        isFollowing: req.isFollowing,
        posts,
        profileUsername: req.userProfile.username,
        profileAvatar: req.userProfile.avatar,
        profileImg: req.userProfile.profile,
        count: {
          postCount: req.postCount,
          followerCount: req.followerCount,
          followingCount: req.followingCount,
        },
      });
    })
    .catch(() => {
      res.render("404");
    });
};

exports.mustBeLoggedIn = (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    req.flash("errors", "you must be logged in to perform such a action.");
    req.session.save(() => {
      res.redirect("/");
    });
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.login = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      req.session.user = { ...result };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("errors", err.errors);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.register = (req, res) => {
  let user = new User(req.body);
  user
    .register()
    .then(() => {
      req.session.user = {
        username: user.data.username,
        avatar: user.avatar,
        _id: user.data._id,
        confirmedEmail: user.data.confirmedEmail,
      };
      req.session.save(() => {
        res.redirect("/");
      });
    })
    .catch((err) => {
      req.flash("regErrors", err);
      req.session.save(() => {
        res.redirect("/");
      });
    });
};

exports.sharedProfileData = async (req, res, next) => {
  let isFollowing = false;
  let isVisitorsProfile = false;
  if (req.session.user) {
    isVisitorsProfile = req.visitorId.equals(req.userProfile._id);
    isFollowing = await Follow.isVisitorFollowing(req.visitorId, req.userProfile._id);
  }
  req.isVisitorsProfile = isVisitorsProfile;
  req.isFollowing = isFollowing;

  let postsCountPromise = Post.postCount(req.userProfile._id);
  let followerCountPromise = Follow.followersCount(req.userProfile._id);
  let followingCountPromise = Follow.followingCount(req.userProfile._id);
  let [postCount, followerCount, followingCount] = await Promise.all([postsCountPromise, followerCountPromise, followingCountPromise]);
  req.postCount = postCount;
  req.followerCount = followerCount;
  req.followingCount = followingCount;
  next();
};

exports.profileFollowersScreen = (req, res) => {
  Follow.findFollowers(req.userProfile._id)
    .then((followers) => {
      res.render("profile-followers", {
        followers,
        isVisitorsProfile: req.isVisitorsProfile,
        isFollowing: req.isFollowing,
        profileUsername: req.userProfile.username,
        profileAvatar: req.userProfile.avatar,
        profileImg: req.userProfile.profile,
        count: {
          postCount: req.postCount,
          followerCount: req.followerCount,
          followingCount: req.followingCount,
        },
      });
    })
    .catch(() => {
      res.render("404");
    });
};
exports.profileFollowingScreen = (req, res) => {
  Follow.findFollowing(req.userProfile._id)
    .then((following) => {
      res.render("profile-following", {
        following,
        isVisitorsProfile: req.isVisitorsProfile,
        isFollowing: req.isFollowing,
        profileUsername: req.userProfile.username,
        profileAvatar: req.userProfile.avatar,
        profileImg: req.userProfile.profile,
        count: {
          postCount: req.postCount,
          followerCount: req.followerCount,
          followingCount: req.followingCount,
        },
      });
    })
    .catch(() => {
      res.render("404");
    });
};

exports.doesUsernameExists = (req, res) => {
  User.findByUsername(req.body.username)
    .then(() => {
      res.json({ usernameExists: true });
    })
    .catch(() => {
      res.json({ usernameExists: false });
    });
};

exports.doesEmailExists = (req, res) => {
  User.findByEmail(req.body.email)
    .then((response) => {
      res.json({ emailExists: response });
    })
    .catch(() => {
      res.status(500).json({ error: "server erro" });
    });
};

exports.verifyEmail = async (req, res) => {
  try {
    const paylod = await User.verifyEmail(req.params.token, req.visitorId);
    req.session.user.confirmedEmail = true;
    req.flash("success", `Email verified`);
    req.session.save(() => {
      res.redirect("/");
    });
  } catch (err) {
    req.flash("errors", err);
    req.session.save(() => {
      res.redirect("/");
    });
  }
};

exports.resendEmail = async (req, res) => {
  if (req.visitorId.equals(req.params.id)) {
    try {
      await User.sendEmailConfirmation({ _id: req.params.id }, req.session.user.email, req.session.user.username);
      req.flash("success", `Email sent successfully.`);
      req.session.save(() => {
        res.redirect("/");
      });
    } catch (err) {
      req.flash("errors", err);
      req.session.save(() => {
        res.redirect("/");
      });
    }
  }
};

exports.ifVerifiedEmail = (req, res, next) => {
  if (req.session.user.confirmedEmail) {
    next();
  } else {
    req.flash("errors", "You cannot perform such a action until you verify your email");
    req.session.save(() => {
      res.redirect("/");
    });
  }
};

exports.editProfileScreen = (req, res) => {
  if (req.params.username == req.session.user.username) {
    User.findByUsername(req.session.user.username)
      .then((userDoc) => {
        res.render("edit-profile", { userDoc });
      })
      .catch(() => {
        res.render("404");
      });
  } else {
    req.flash("errors", "You do not have the permission to perform such a action.");
    req.session.save(() => {
      res.redirect("/");
    });
  }
};

exports.uploadImage = (req, res) => {
  User.uploadImage(req.session.user._id, req.file.filename, req.session.user.profile)
    .then(() => {
      req.session.user.profile = req.file.filename;
      req.session.save(() => {
        res.json("success");
      });
    })
    .catch(() => {
      res.json("failure");
    });
};

// API related

exports.apiAuth = (req, res, next) => {
  jsonWebToken.verify(req.body.token, process.env.JSONSECRET, (err, decode) => {
    if (err) {
      res.status(401).json({ status: "Must be logged in", err });
      return;
    }
    req.token = decode;
    next();
  });
};

exports.apiLogin = (req, res) => {
  let user = new User(req.body);
  user
    .login()
    .then((result) => {
      jsonWebToken.sign(result, process.env.JSONSECRET, { expiresIn: "1h", issuer: result.username }, (err, token) => {
        if (err) {
          res.status(402).json("unkown error");
          return;
        }
        res.json({ token });
      });
    })
    .catch((err) => {
      res.status(401).json(err);
    });
};

exports.apiIfUserExists = (req, res, next) => {
  User.findByUsername(req.params.username)
    .then((userDoc) => {
      req.user = userDoc;
      next();
    })
    .catch(() => {
      res.json({ error: "no such a author" });
    });
};
