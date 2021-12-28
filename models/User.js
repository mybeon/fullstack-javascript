require("dotenv").config();
const validator = require("validator");
const usersCollection = require("../db").collection("users");
const bcrypt = require("bcrypt");
const md5 = require("md5");
const jsonWebToken = require("jsonwebtoken");
const mailer = require("../emails/nodemailer");
const confirmationEmailTemplate = require("../emails/templates/email-confirmation");
const ObjectId = require("mongodb").ObjectId;
const { unlink } = require("fs");

let User = function (data, getAvatar) {
  this.data = data;
  this.errors = [];
  if (getAvatar == undefined) {
    getAvatar = false;
  }
  if (getAvatar) {
    this.getAvatar();
  }
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("username must not be empty");
  }
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username, "en-US", { ignore: " " })) {
    this.errors.push("username must be alphanumeric");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("must enter a valid email");
  }
  if (this.data.password == "") {
    this.errors.push("password must not be empty");
  }

  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("password must exceed 12 characters");
  }
  if (this.data.password.length > 50) {
    this.errors.push("password must be less than 50 characters");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("username must exceed 3 characters");
  }
  if (this.data.username.length > 30) {
    this.errors.push("username must be less than 30 characters");
  }
};

User.prototype.validateLogin = function () {
  if (this.data.username == "") {
    this.errors.push("username must not be empty");
  }
  if (this.data.username != "" && !validator.isAlphanumeric(this.data.username, "en-US", { ignore: " " })) {
    this.errors.push("username must be alphanumeric");
  }
  if (this.data.password == "") {
    this.errors.push("password must not be empty");
  }

  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("password must exceed 12 characters");
  }
  if (this.data.password.length > 100) {
    this.errors.push("password must be less than 100 characters");
  }
  if (this.data.username.length > 0 && this.data.username.length < 3) {
    this.errors.push("username must exceed 3 characters");
  }
  if (this.data.username.length > 30) {
    this.errors.push("username must be less than 30 characters");
  }
};

User.prototype.login = function () {
  return new Promise((res, rej) => {
    this.cleanUp();
    this.validateLogin();
    if (!this.errors.length) {
      usersCollection
        .findOne({ username: this.data.username })
        .then((user) => {
          if (user && bcrypt.compareSync(this.data.password, user.password)) {
            this.data.email = user.email;
            this.getAvatar();
            this.data = {
              _id: user._id,
              username: this.data.username,
              avatar: this.avatar,
              confirmedEmail: user.confirmedEmail,
              email: user.email,
              profile: user.profileImg,
            };
            res({ ...this.data });
          } else {
            rej({ success: false, errors: "invalid username/password" });
          }
        })
        .catch((err) => {
          rej({ type: "db", errors: err });
        });
    } else {
      rej({ type: "validation", errors: this.errors });
    }
  });
};

User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    this.validate();

    if (!this.errors.length) {
      try {
        let usernameExists = await usersCollection.findOne({
          username: this.data.username,
        });
        let emailExists = await usersCollection.findOne({
          email: this.data.email,
        });
        if (usernameExists || emailExists) {
          reject("email/username is already taken");
        } else {
          let salt = bcrypt.genSaltSync(10);
          this.data.password = bcrypt.hashSync(this.data.password, salt);
          this.data.confirmedEmail = false;
          const newUser = await usersCollection.insertOne(this.data);
          await User.sendEmailConfirmation({ _id: newUser.insertedId }, this.data.email, this.data.username);
          this.data._id = newUser.insertedId;
          this.getAvatar();
          resolve();
        }
      } catch (e) {
        reject(e);
      }
    } else {
      reject(this.errors);
    }
  });
};

User.findByUsername = function (username) {
  return new Promise((resolve, reject) => {
    if (typeof username != "string") {
      reject();
      return;
    }
    usersCollection
      .findOne({ username })
      .then((user) => {
        let userEmail = user.email;
        let userProfile = user.profileImg;
        if (user) {
          user = new User(user, true);
          user = {
            _id: user.data._id,
            username: user.data.username,
            avatar: user.avatar,
            email: userEmail,
            profile: userProfile,
          };
          resolve(user);
        } else {
          reject();
        }
      })
      .catch(() => {
        reject();
      });
  });
};

User.findByEmail = function (email) {
  return new Promise((resolve, reject) => {
    if (typeof email != "string" || !validator.isEmail(email)) {
      reject();
      return;
    }
    usersCollection
      .findOne({ email })
      .then((user) => {
        if (user) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch(() => {
        reject();
      });
  });
};

User.sendEmailConfirmation = function (payload, email, username) {
  return new Promise((resolve, reject) => {
    jsonWebToken.sign(payload, process.env.JSONSECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) reject("token error");
      mailer
        .sendMail({
          from: process.env.SMTP_SENDER,
          to: email,
          subject: "Email confirmation",
          text: `Please verify your email by clicking this link ${process.env.NODE_ENV ? process.env.PROD_URL : process.env.DEV_URL}/verify/${token}`,
          html: confirmationEmailTemplate(username, token),
        })
        .then((info) => {
          resolve(info);
        })
        .catch((err) => {
          console.log("nodemailer", err);
          reject("Unexpected error !");
        });
    });
  });
};

User.verifyEmail = function (token, visitorId) {
  return new Promise((resolve, reject) => {
    jsonWebToken.verify(token, process.env.JSONSECRET, async (err, decode) => {
      if (err) return reject(err.message.replace("jwt", "Link has"));
      if (visitorId.equals(decode._id)) {
        await usersCollection.findOneAndUpdate(
          { _id: new ObjectId(decode._id) },
          {
            $set: {
              confirmedEmail: true,
            },
          }
        );
        resolve();
      } else {
        reject("Don't have the permission");
      }
    });
  });
};

User.uploadImage = function (id, img, sessionProfile) {
  return new Promise((resolve, reject) => {
    if (sessionProfile) {
      unlink(`public/uploads/${sessionProfile}`, (err) => {
        if (err) console.log(err);
      });
    }
    usersCollection
      .updateOne({ _id: id }, { $set: { profileImg: img } })
      .then(() => resolve())
      .catch(() => reject());
  });
};

User.prototype.getAvatar = function () {
  this.avatar = `https://www.gravatar.com/avatar/${md5(this.data.email)}?s=128&d=robohash`;
};

module.exports = User;
