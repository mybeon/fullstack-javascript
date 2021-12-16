const postCollection = require("../db").collection("posts");
const followCollection = require("../db").collection("follows");
const ObjectID = require("mongodb").ObjectId;
const User = require("./User");
const sanitizeHtml = require("sanitize-html");

let Post = function (data, userid, postID) {
  this.data = data;
  this.errors = [];
  this.userid = userid;
  this.postID = postID;
};

Post.prototype.cleanUp = function () {
  if (typeof this.data.title != "string") {
    this.data.title = "";
  }
  if (typeof this.data.body != "string") {
    this.data.body = "";
  }

  this.data = {
    title: sanitizeHtml(this.data.title.trim(), { allowedTags: [], allowedAttributes: {} }),
    body: sanitizeHtml(this.data.body.trim(), { allowedTags: [], allowedAttributes: {} }),
    createdAt: new Date(),
    author: ObjectID(this.userid),
  };
};

Post.prototype.validate = function () {
  if (this.data.title == "") {
    this.errors.push("title must not be empty");
  }
  if (this.data.body == "") {
    this.errors.push("body must not be empty");
  }
};

Post.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      postCollection
        .insertOne(this.data)
        .then((post) => {
          resolve({ success: true, post });
        })
        .catch(() => {
          this.errors.push("internal error, try later");
          reject(this.errors);
        });
    } else {
      resolve({ success: false, errors: this.errors });
    }
  });
};

Post.prototype.update = function () {
  return new Promise((resolve, reject) => {
    Post.findPostbyId(this.postID, this.userid)
      .then(async (post) => {
        if (post.isPostOwner) {
          let status = await this.actUpdate();
          resolve(status);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

Post.prototype.actUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();
    if (!this.errors.length) {
      await postCollection.findOneAndUpdate(
        { _id: new ObjectID(this.postID) },
        {
          $set: {
            title: this.data.title,
            body: this.data.body,
            updatedAt: new Date(),
          },
        }
      );
      resolve("success");
    } else {
      resolve("failure");
    }
  });
};

Post.reusablePostQuery = function (uniqueAgg, visitorId, finalAgg = []) {
  return new Promise(async (resolve, reject) => {
    let queryAgg = uniqueAgg
      .concat([
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "authorDocument",
          },
        },
        {
          $project: {
            _id: 1,
            title: 1,
            body: 1,
            createdAt: 1,
            authorId: "$author",
            updatedAt: 1,
            author: {
              $arrayElemAt: ["$authorDocument", 0],
            },
          },
        },
      ])
      .concat(finalAgg);
    let posts = await postCollection.aggregate(queryAgg).toArray();

    posts = posts.map((post) => {
      post.isPostOwner = post.authorId.equals(visitorId);
      post.authorId = undefined;
      post.author = {
        username: post.author.username,
        avatar: new User(post.author, true).avatar,
        profile: post.author.profileImg,
      };
      return post;
    });
    resolve(posts);
  });
};

Post.findPostbyId = function (id, visitorId) {
  return new Promise(async (resolve, reject) => {
    if (typeof id != "string" || !ObjectID.isValid(id)) {
      reject("Invalid id");
      return;
    }
    let posts = await Post.reusablePostQuery([{ $match: { _id: new ObjectID(id) } }], visitorId);
    if (posts.length) {
      resolve(posts[0]);
    } else {
      reject("Post not found");
    }
  });
};

Post.findByAuthorId = function (authorId) {
  return Post.reusablePostQuery([{ $match: { author: authorId } }, { $sort: { createdAt: -1 } }]);
};

Post.delete = function (id, visitorId) {
  return new Promise((resolve, reject) => {
    Post.findPostbyId(id, visitorId)
      .then(async (post) => {
        if (post.isPostOwner) {
          await postCollection.deleteOne({ _id: new ObjectID(id) });
          resolve("success");
        } else {
          reject("Operation denied");
        }
      })
      .catch((err) => {
        reject(err);
      });
  });
};

Post.search = function (searchTerm) {
  return new Promise(async (resolve, reject) => {
    if (typeof searchTerm != "string") {
      reject();
      return;
    }
    try {
      let searchPosts = await Post.reusablePostQuery([{ $match: { $text: { $search: searchTerm } } }], undefined, [{ $sort: { $score: { $meta: "textScore" } } }]);
      resolve(searchPosts);
    } catch {
      reject();
    }
  });
};

Post.postCount = function (id) {
  return new Promise(async (resolve, reject) => {
    postCollection
      .countDocuments({ author: id })
      .then((count) => {
        resolve(count);
      })
      .catch(() => {
        reject("mongo error");
      });
  });
};

Post.postFeed = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followedUsers = await followCollection.find({ authorID: id }).toArray();
      followedUsers = followedUsers.map((followed) => {
        return followed.followedID;
      });
      if (followedUsers.length) {
        let posts = await Post.reusablePostQuery([{ $match: { author: { $in: followedUsers } } }, { $sort: { createdAt: -1 } }]);
        resolve(posts);
      } else {
        resolve([]);
      }
    } catch {
      reject("internal probleme");
    }
  });
};

module.exports = Post;
