const ObjectID = require("mongodb").ObjectId;
const followsCollection = require("../db").collection("follows");
const User = require("./User");

let Follow = function (followingID, followedUsername) {
  this.followingID = followingID;
  this.followedUsername = followedUsername;
  this.errors = [];
};

Follow.prototype.cleanUp = function () {
  if (typeof this.followedUsername != "string") {
    this.followedUsername = "";
  }
};
Follow.prototype.validate = async function () {
  if (this.followedUsername != "") {
    let user = await User.findByUsername(this.followedUsername);
    if (user) {
      this.followedID = user._id;
      if (this.followingID.equals(user._id)) {
        this.errors.push("You cannot follow yourself");
      } else {
        let isFollowing = await Follow.isVisitorFollowing(this.followingID, this.followedID);
        this.isFollowing = isFollowing;
      }
    } else {
      this.errors.push("User does not exist");
    }
  }
};

Follow.isVisitorFollowing = async function (visitor, followed) {
  try {
    let followingExists = await followsCollection.findOne({ authorID: visitor, followedID: new ObjectID(followed) });
    if (followingExists) {
      return true;
    } else {
      return false;
    }
  } catch {
    console.log("unexpected server");
  }
};

Follow.prototype.create = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();
    if (!this.errors.length) {
      if (!this.isFollowing) {
        await followsCollection.insertOne({ authorID: this.followingID, followedID: new ObjectID(this.followedID) });
        resolve();
      } else {
        reject("You cannot follow a user twice");
      }
    } else {
      reject(this.errors);
    }
  });
};

Follow.prototype.delete = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    await this.validate();
    if (!this.errors.length) {
      if (this.isFollowing) {
        await followsCollection.deleteOne({ authorID: this.followingID, followedID: new ObjectID(this.followedID) });
        resolve();
      } else {
        reject("You cannot unfollow a user twice");
      }
    } else {
      reject(this.errors);
    }
  });
};

Follow.findFollowers = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followers = await followsCollection
        .aggregate([
          { $match: { followedID: id } },
          {
            $lookup: {
              from: "users",
              localField: "authorID",
              foreignField: "_id",
              as: "followerDoc",
            },
          },
          {
            $project: {
              username: { $arrayElemAt: ["$followerDoc.username", 0] },
              email: { $arrayElemAt: ["$followerDoc.email", 0] },
            },
          },
        ])
        .toArray();
      if (followers) {
        followers = followers.map((follower) => {
          return {
            username: follower.username,
            avatar: new User(follower, true).avatar,
          };
        });
        resolve(followers);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject("Server error");
    }
  });
};
Follow.findFollowing = function (id) {
  return new Promise(async (resolve, reject) => {
    try {
      let followings = await followsCollection
        .aggregate([
          { $match: { authorID: id } },
          {
            $lookup: {
              from: "users",
              localField: "followedID",
              foreignField: "_id",
              as: "followerDoc",
            },
          },
          {
            $project: {
              username: { $arrayElemAt: ["$followerDoc.username", 0] },
              email: { $arrayElemAt: ["$followerDoc.email", 0] },
            },
          },
        ])
        .toArray();
      if (followings) {
        followings = followings.map((follower) => {
          return {
            username: follower.username,
            avatar: new User(follower, true).avatar,
          };
        });
        resolve(followings);
      } else {
        resolve([]);
      }
    } catch (error) {
      reject("Server error");
    }
  });
};

Follow.followersCount = function (id) {
  return new Promise(async (resolve, reject) => {
    followsCollection
      .countDocuments({ followedID: id })
      .then((count) => {
        resolve(count);
      })
      .catch(() => {
        reject("mongo error");
      });
  });
};
Follow.followingCount = function (id) {
  return new Promise(async (resolve, reject) => {
    followsCollection
      .countDocuments({ authorID: id })
      .then((count) => {
        resolve(count);
      })
      .catch(() => {
        reject("mongo error");
      });
  });
};

module.exports = Follow;
